$(document).ready(function () {
  const loginModal = $('#loginModal');
  const btnLogin = $('#btnLogin');
  const pfp = $('#pfp');
  const btnPubblicaPost = $('#btnPubblicaPost');
  const txtPensiero = $('#txtPensiero');
  const newPostFile = $('#newPostFile');

  const header = $('.container .row').eq(0);
  const facebookImage = $('.container .row').eq(1);
  const newPost = $('.container .row').eq(2).hide();
  const table = $('.container .row').eq(3).hide();

  let user = null;

  $('#btnOk').click(async function () {
    const username = $('#user').val();
    const password = $('#pass').val();
    const response = await inviaRichiesta('POST', '/api/login', { username, password });
    if (response.status === 401) {
      alert('Credenziali errate');
      return;
    }
    if (response.status !== 200) {
      alert('Errore nel login');
      return;
    }

    user = username;
    loginModal.modal('hide');
    facebookImage.hide();
    btnLogin.hide();
    pfp.prop('src', `img/users/${response.data.img}`);
    newPost.show();
    loadPosts();
  });

  btnPubblicaPost.on('click', async function () {
    const pensiero = txtPensiero.val();
    const file = newPostFile.prop('files')[0];
    const formData = new FormData();
    formData.append('user', user);
    formData.append('pensiero', pensiero);
    formData.append('file', file);
    const response = await inviaRichiesta('POST', '/api/newPost', formData);
    if (response.status === 400) {
      alert('Immetti un pensiero');
      return;
    }
    if (response.status !== 200) {
      alert('Errore nella pubblicazione del post');
      return;
    }
    loadPosts();
  });

  async function loadPosts() {
    const response = await inviaRichiesta('GET', '/api/posts');
    if (response.status !== 200) {
      alert('Errore nel caricamento dei post');
      return;
    }

    table.show();
    const tbody = $(document).find('tbody').empty();
    for (const element of response.data) {
      const nLikeSpan = $('<span>').text(element.nLike);
      const td = $('<td>')
        .addClass('text-left')
        .append(
          $('<span>')
            .text(`${new Date(element.date).toLocaleString()} - ${element.user}`)
            .append($('<br>'))
        )
        .append($('<span>').text(element.post).append($('<br>')));
      const tr = $('<tr>').append(td);
      if (element.img) {
        td.append($('<img>').prop('src', `img/photos/${element.img}`));
      }
      td.append($('<br>'))
        .append($('<img>').prop({ src: 'img/like.png', width: 26 }))
        .append(nLikeSpan)
        .append(
          $('<button>')
            .html('&#x1F44D Mi piace')
            .on('click', function () {
              addLike(element._id, nLikeSpan, this);
            })
        );
      tbody.append(tr);
    }
  }

  async function addLike(id, nLikeSpan, button) {
    const response = await inviaRichiesta('POST', '/api/addLike', { id });
    if (response.status !== 200) {
      alert('Impossibile mettere mi piace');
      return;
    }
    nLikeSpan.html(parseInt(nLikeSpan.html()) + 1);
    console.log(this);
    button.disabled = true;
  }
});
