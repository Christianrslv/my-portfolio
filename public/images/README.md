# Images Directory

Place your profile photo here!

## How to Add Your Photo

1. **Add your photo file** to this directory (`public/images/`)
   - Recommended formats: `.jpg`, `.jpeg`, or `.png`
   - Recommended size: 800x800px or larger (square works best)
   - Recommended filename: `profile.jpg` or `profile.png`

2. **Update the image path** in `src/content/about/index.md`:
   ```yaml
   imageUrl: "/images/profile.jpg"  # Change to match your filename
   imageAlt: "Your Name - Your Title"  # Update with your info
   ```

3. **Save and refresh** - your photo will appear in the About section!

## Tips

- Use a square photo (1:1 aspect ratio) for best results
- Compress large images to keep the site fast
- Make sure the file is named correctly and matches the `imageUrl` in the markdown file
