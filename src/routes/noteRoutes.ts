import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const keyword = req.query.keyword as string | undefined;
    const course = req.query.course as string | undefined;
    const tag = req.query.tag as string | undefined;

    const notes = await prisma.note.findMany({
      where: {
        AND: [
          keyword
            ? {
                OR: [
                  {
                    title: {
                      contains: keyword,
                    },
                  },
                  {
                    description: {
                      contains: keyword,
                    },
                  },
                ],
              }
            : {},
          course
            ? {
                course: {
                  contains: course,
                },
              }
            : {},
          tag
            ? {
                tags: {
                  some: {
                    tag: {
                      name: {
                        contains: tag,
                      },
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        favorites: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, fileUrl, course } = req.body;

    if (!title || !fileUrl || !course) {
      return res.status(400).json({
        message: "Title, fileUrl and course are required",
      });
    }

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        description,
        fileUrl,
        course,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("Create note error:", error);
    return res.status(500).json({
      message: "Failed to create note",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        favorites: true,
      },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.json(note);
  } catch (error) {
    console.error("Get note by id error:", error);
    return res.status(500).json({
      message: "Failed to fetch note",
    });
  }
});

export default router;