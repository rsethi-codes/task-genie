import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // TODO: Save to database
    console.log('Onboarding data received:', { userId, ...data })

    // Example: Save to your database
    // const user = await db.user.update({
    //   where: { clerkId: userId },
    //   data: {
    //     preferences: data,
    //     isOnboarded: true,
    //   },
    // })

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      userId,
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}