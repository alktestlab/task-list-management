import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/tasks - Get all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    const statusFilter = searchParams.get('status');
    const priorityFilter = searchParams.get('priority');

    let whereClause: any = {};

    // Add search functionality
    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery } },
        { description: { contains: searchQuery } },
      ];
    }

    // Add status filter
    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    // Add priority filter
    if (priorityFilter) {
      whereClause.priority = priorityFilter;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, status, priority } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'pending',
        priority: priority || 'medium',
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
