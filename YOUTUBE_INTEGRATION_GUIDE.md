# YouTube Video Integration Guide for AI Physio

## ✅ What's Already Implemented

1. **YouTube Embed Support**: The workout session page now automatically detects YouTube URLs and converts them to proper embed format
2. **Fallback Support**: If it's not a YouTube URL, it falls back to direct video file playback
3. **Responsive Design**: Videos are properly sized and responsive

## 🎯 How to Add Real Physiotherapy Videos

### Step 1: Find Real Physiotherapy Videos

Search YouTube for these specific exercises:

#### **Neck & Shoulder Exercises:**
- "neck roll exercise physiotherapy"
- "shoulder shrug physiotherapy" 
- "arm circles warm up exercise"

#### **Back & Spine Exercises:**
- "cat cow stretch yoga"
- "child's pose yoga"
- "seated spinal twist"
- "forward fold stretch"

#### **Hip & Leg Exercises:**
- "hip flexor stretch"
- "gentle spinal twist"

### Step 2: Recommended YouTube Channels

Look for videos from these reputable physiotherapy channels:
- **Bob & Brad** (Physical Therapists) - Very popular, clear demonstrations
- **Ask Doctor Jo** - Professional physiotherapy content
- **PhysioTutors** - Educational physiotherapy videos
- **Yoga with Adriene** - Great for stretching exercises
- **Physiotherapy Exercises** - Professional demonstrations

### Step 3: Replace Video URLs

In `/src/routes/api/workout/generate/+server.ts`, find these lines and replace the placeholder URLs:

```typescript
// Current placeholder (line ~174):
videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Neck Rolls - Replace with real physiotherapy video

// Replace with real YouTube URL like:
videoUrl: "https://www.youtube.com/watch?v=REAL_VIDEO_ID",
```

### Step 4: Test the Integration

1. Run `npm run dev`
2. Generate a workout
3. Start a workout session
4. Check that videos load properly in the exercise view

## 🔧 Technical Details

### YouTube URL Conversion
The system automatically converts YouTube URLs to embed format:
- `https://www.youtube.com/watch?v=VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`
- `https://youtu.be/VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`

### Embed Parameters
Videos are embedded with these parameters for better UX:
- `rel=0` - Reduces related videos
- `modestbranding=1` - Minimal YouTube branding

## 🎬 Example Real Video URLs

Here are some example searches to find real videos:

1. **Neck Rolls**: Search "Bob and Brad neck roll exercise"
2. **Shoulder Shrugs**: Search "shoulder shrug physiotherapy"
3. **Cat-Cow Stretch**: Search "cat cow stretch yoga"
4. **Child's Pose**: Search "child's pose yoga"
5. **Hip Flexor Stretch**: Search "hip flexor stretch"

## 🚀 For Your Hackathon Demo

1. **Quick Setup**: Replace at least 3-4 video URLs with real physiotherapy videos
2. **Professional Look**: Use videos from reputable physiotherapy channels
3. **Clear Demonstrations**: Choose videos with clear, slow demonstrations
4. **Good Audio**: Ensure videos have clear instructions

## 📝 Current Status

- ✅ YouTube embed system implemented
- ✅ Automatic URL conversion working
- ✅ Responsive video display
- ⏳ Need to replace placeholder URLs with real videos
- ⏳ Test with real physiotherapy content

The system is ready - you just need to find and replace the video URLs with real physiotherapy exercise videos!
