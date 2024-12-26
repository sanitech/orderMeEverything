export default function compressImage(file, status) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const imageFilename = file.name;
    reader.readAsDataURL(file);

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = status == "profile" ? 170 : img.width * 0.8;
        const maxHeight = status == "profile" ? 170 : img.height * 0.8;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          function (blob) {
            const file = new File([blob], imageFilename, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(file);
          },
          "image/jpeg",
          0.6 // Adjust the quality as needed (0.2 = 80% compression)
        );
      };

      img.onerror = function (error) {
        reject(error);
      };
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
}
