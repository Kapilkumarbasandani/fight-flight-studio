# Video Setup Instructions

## 🎥 Adding Videos to Your Website

The website is configured to use local video files. Follow these steps to add your videos:

### Required Videos

You need **3 video files** in the `public/videos/` folder:

1. **muaythai-hero.mp4** - Hero section background (Muay Thai training)
2. **muaythai.mp4** - VideoShowcase Muay Thai segment
3. **aerial.mp4** - VideoShowcase Aerial Dance segment

### Where to Get Videos

#### Option 1: Download from Pexels (Free)

1. Visit [Pexels Videos](https://www.pexels.com/videos/)
2. Search for:
   - "muay thai training"
   - "boxing workout"
   - "aerial silks"
   - "aerial dance"
   - "circus aerial"

3. **Recommended Videos:**
   - Muay Thai: https://www.pexels.com/video/6765450/
   - Muay Thai Alt: https://www.pexels.com/video/4761792/
   - Aerial Dance: https://www.pexels.com/video/7045657/
   - Aerial Alt: https://www.pexels.com/video/8520408/

4. Click **"Free Download"** button (NOT the video URL)
5. Choose **1920x1080 (HD)** or higher resolution

#### Option 2: Use Your Own Studio Footage

Record videos of:
- Muay Thai training sessions
- Aerial dance performances
- Make them 8-10 seconds long
- Use landscape orientation (16:9)
- Export in MP4 format

### How to Add Videos

1. **Download** your chosen videos to your computer

2. **Rename them** to:
   - `muaythai-hero.mp4`
   - `muaythai.mp4`
   - `aerial.mp4`

3. **Copy them** to the project folder:
   ```
   fight-flight-studio/public/videos/
   ```

### Using PowerShell to Copy Videos

```powershell
# Example: Copy downloaded videos
Copy-Item "C:\Users\YourName\Downloads\pexels-video-6765450.mp4" "c:\Personal project\fight-flight-studio\public\videos\muaythai-hero.mp4"
Copy-Item "C:\Users\YourName\Downloads\pexels-video-4761792.mp4" "c:\Personal project\fight-flight-studio\public\videos\muaythai.mp4"
Copy-Item "C:\Users\YourName\Downloads\pexels-video-7045657.mp4" "c:\Personal project\fight-flight-studio\public\videos\aerial.mp4"
```

### Video Specifications

**Recommended:**
- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 (Full HD) or higher
- Duration: 8-15 seconds (will loop)
- File size: Under 50MB each for faster loading
- Aspect ratio: 16:9 (landscape)

**Optimization Tips:**
- Use a video compressor if files are too large
- Keep bitrate reasonable (5-10 Mbps for HD)
- Remove audio track if not needed (videos are muted anyway)

### Current Status

The website will show a **gradient background** until videos are added. Once you copy the videos to the `public/videos/` folder, they will automatically appear when you refresh the page.

### Troubleshooting

**Videos not playing?**
- Check file names match exactly: `muaythai-hero.mp4`, `muaythai.mp4`, `aerial.mp4`
- Ensure files are in `public/videos/` folder
- Try refreshing the browser (Ctrl+F5)
- Check browser console for errors

**Videos loading slowly?**
- Compress videos to smaller file sizes
- Use 1080p instead of 4K
- Consider using a video hosting service (Vimeo, YouTube)

---

## Quick Start

1. Visit Pexels and download 3 videos
2. Rename them to the required names above
3. Copy to `fight-flight-studio/public/videos/`
4. Refresh your browser at http://localhost:3000
5. Videos should autoplay!
