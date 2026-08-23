# Wire up Mini Pack links and page previews

## What gets done

**1. Download links**

- Money Maths card + detail page → `https://selar.com/glitchdetectives_money_math`
- Glitch Detectives Mini Pack card + detail page → `https://selar.com/548i3377r9`

Both "Download" buttons appear automatically once the URLs are set.

**2. Real page previews for Money Maths**

- Fetch the PDF from the shared Google Drive file and render its 4 pages to images.
- Save them as `public/printables/mini-packs/money-maths/page-1.jpg` … `page-4.jpg`.
- Page 1 becomes the card cover on `/printables`; all 4 show in the lightbox gallery on `/printables/mini-packs/money-maths`.

**3. Mixed Missions pack**

- Still has no PDF, so its 6 preview pages stay as fallback tiles until you send the file (the Selar download button will work regardless).

## Technical notes

- Edit only `src/components/printables/miniPacks.ts` (add `downloadUrl` to both packs).
- Download via the Drive direct-download endpoint (`uc?export=download&id=15Koar…`), render with `pdftoppm`, JPEG-compress to web size — same pipeline used for the fractions samples.
- If the Drive file isn't publicly downloadable, I'll report back and you can upload the PDF directly instead.

## What I still need

- The Money Maths PDF is covered by the Drive link; the Mixed Missions PDF and the third combined-topic pack (file + title + description) are still outstanding.
