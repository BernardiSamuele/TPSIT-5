$(document).ready(function () {
  let txtUser = $('#txtUser');
  let txtFile = $('#txtFile');
  let imgPreview = $('#imgPreview');

  getImages();

  //PREVIEW

  //Metodo con then&catch
  // txtFile.on("change", function(){
  // 	if(txtFile.val())
  // 	{
  // 		const blob = txtFile.prop("files")[0];
  // 		base64Convert(blob)
  // 		.then(function(base64Img){
  // 			imgPreview.prop("src", base64Img);
  // 		})
  // 		.catch(function(err){
  // 			alert(err);
  // 		})
  // 	}
  // });

  //Metodo con async/await
  txtFile.on('change', async function () {
    if (txtFile.val()) {
      const blob = txtFile.prop('files')[0];
      const base64img = await base64Convert(blob).catch(function (err) {
        alert(err);
      });
      imgPreview.prop('src', base64img);
    }
  });

  // aumentare il timeout a 10 sec perchè cloudinary ci mette molto a rispondere !

  async function getImages() {
    const response = await inviaRichiesta('GET', '/api/images');
    if (response.status == 200) {
      console.log(response);

      let tbody = $('#mainTable').children('tbody');
      tbody.empty();
      response.data.forEach(element => {
        const tr = $('<tr>').appendTo(tbody).addClass('text-center');
        $('<td>').appendTo(tr).text(element.username);
        let td = $('<td>').appendTo(tr);
        if (element.img) {
          if (!element.img.startsWith('data:image') && !element.img.startsWith('https://')) {
            element.img = './img/' + element.img;
          }
        }
        $('<img>')
          .prop('src', element.img)
          .appendTo(td)
          .on('error', function () {
            this.src = './img/user.png';
          });
      });
    } else {
      alert(response.status + ': ' + response.err);
    }
  }

  $('#btnBinary').on('click', async function () {
    const user = txtUser.val();
    const img = txtFile.prop('files')[0];

    if (!user || !img) {
      alert('Error: you must put an user and a image');
      return;
    } else {
      const formData = new FormData();
      formData.append('user', user);
      formData.append('img', img);
      const response = await inviaRichiesta('POST', '/api/uploadBinary', formData);
      if (response.status == 200) {
        console.log(response.data);
        alert('Upload completed correctly!');
        getImages();
      } else {
        alert(response.status + ': ' + response.err);
      }
    }
  });

  $('#btnBase64').on('click', async function () {
    let user = txtUser.val();
    let img = txtFile.prop('files')[0];
    if (!user || !img) {
      alert('complete the username and img slot before');
      return;
    } else {
      let imgBase64 = await base64Convert(img).catch(function (err) {
        alert(err);
      });
      let params = {
        user,
        img: imgBase64,
        imgName: img.name
      };
      const response = await inviaRichiesta('POST', '/api/uploadBase64', params);
      if (response.status == 200) {
        console.log(response.data);
        alert('Upload completed correctly!');
        getImages();
      } else {
        alert(response.status + ': ' + response.err);
      }
    }
  });

  $('#btnBinaryCloudinary').on('click', async function () {
    const user = txtUser.val();
    const img = txtFile.prop('files')[0];

    if (!user || !img) {
      alert('Error: you must put an user and a image');
      return;
    } else {
      const formData = new FormData();
      formData.append('user', user);
      formData.append('img', img);
      const response = await inviaRichiesta('POST', '/api/uploadCloudinary', formData);
      if (response.status == 200) {
        console.log(response.data);
        alert('Upload completed correctly!');
        getImages();
      } else {
        alert(response.status + ': ' + response.err);
      }
    }
  });

  $('#btnBase64Cloudinary').on('click', async function () {
    let user = txtUser.val();
    let img = txtFile.prop('files')[0];
    if (!user || !img) {
      alert('complete the username and img slot before');
      return;
    } else {
      let imgBase64 = await base64Convert(img).catch(function (err) {
        alert(err);
      });
      let params = {
        user,
        img: imgBase64,
        imgName: img.name
      };
      const response = await inviaRichiesta('POST', '/api/uploadCloudinaryBase64', params);
      if (response.status == 200) {
        console.log(response.data);
        alert('Upload completed correctly!');
        getImages();
      } else {
        alert(response.status + ': ' + response.err);
      }
    }
  });
});

/* *********************** resizeAndConvert() ****************************** */

/* riceve un FILE OBJECT e restituisce una immagine base64    */

function resizeAndConvert(img) {
  /*

   step 1: conversione in base64 (tramite FileReader) del file scelto dall'utente
   step 2: assegnazione del file base64 ad un oggetto Image da passare alla libr pica
   step 3: resize mediante la libreria pica che restituisce un canvas
   step 4: conversione del canvas in blob
   step 5: conversione del blob in base64 da inviare al server                */

  return new Promise(function (resolve, reject) {
    const WIDTH = 640;
    const HEIGHT = 480;
    let type = img.type;
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = function () {
      let image = new Image();
      image.src = reader.result;
      image.onload = function () {
        if (image.width < WIDTH && image.height < HEIGHT) resolve(reader.result);
        else {
          let canvas = document.createElement('canvas');
          if (image.width > image.height) {
            canvas.width = WIDTH;
            canvas.height = image.height * (WIDTH / image.width);
          } else {
            canvas.height = HEIGHT;
            canvas.width = image.width * (HEIGHT / image.height);
          }
          let _pica = new pica();
          _pica
            .resize(image, canvas, {
              unsharpAmount: 80,
              unsharpRadius: 0.6,
              unsharpThreshold: 2
            })
            .then(function (resizedImage) {
              // resizedImage è restituita in forma di canvas
              _pica
                .toBlob(resizedImage, type, 0.9)
                .then(function (blob) {
                  var reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onload = function () {
                    resolve(reader.result); //base 64
                  };
                })
                .catch(err => reject(err));
            })
            .catch(function (err) {
              reject(err);
            });
        }
      };
    };
  });
}
