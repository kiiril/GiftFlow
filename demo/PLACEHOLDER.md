# How to Add Your Demo Video

To add your demo video to this repository:

1. Place your .mp4 file in this directory (`demo/`)
2. Rename it to `demo.mp4`
3. Commit and push the file:
   ```bash
   git add demo/demo.mp4
   git commit -m "Add demo video"
   git push
   ```

The video should be an .mp4 file showcasing the GiftFlow application features and functionality.

**Note**: GitHub has file size limits for uploads:
- Web interface: 25 MB maximum
- Command line (git): 100 MB maximum
- For files larger than 100 MB, you must use Git Large File Storage (LFS)

If your video is larger than the limits, consider:
- Compressing the video using tools like HandBrake or FFmpeg
- Using Git Large File Storage (LFS) for files larger than 100 MB
- Alternatively, you can host the video on YouTube, Vimeo, or another platform and update the link in the main README.md to point to the external URL instead of the local file

Once added, the demo video will be accessible via the link in the main README.md file.
