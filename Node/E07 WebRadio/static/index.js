window.onload = function () {
  const lstRegioni = $('#lstRegioni');
  const tbody = $('#tbody');

  getStates();
  lstRegioni.on('change', getRadios);

  async function getStates() {
    const states = await inviaRichiesta('GET', '/api/getStates');
    if (states) {
      console.log(states);
      states.forEach((state) => {
        $('<option>').val(state.name).text(`${state.name} [ ${state.stationcount} emittenti]`).appendTo(lstRegioni);
      });
    }
  }

  async function getRadios() {
    const radios = await inviaRichiesta('GET', '/api/getRadios', { state: this.value });
    if (radios) {
      console.log(radios);
      tbody.empty();
      radios.forEach((radio) => {
        const tr = $('<tr>').appendTo(tbody);

        $('<td>')
          .appendTo(tr)
          .append(
            $('<img>')
              .prop({ src: radio.favicon, width: 40 })
              .on('error', function () {
                this.src = './favicon.ico';
              })
          );
        $('<td>').appendTo(tr).text(radio.name);
        $('<td>').appendTo(tr).text(radio.codec);
        $('<td>').appendTo(tr).text(radio.bitrate);
        $('<td>').appendTo(tr).text(radio.votes);
        $('<td>')
          .appendTo(tr)
          .append(
            $('<img>')
              .prop({ src: './like.jpg', width: 40 })
              .on('click', function () {
                addLike(radio.id);
              })
          );
      });
    }
  }

  async function addLike(id) {
    const response = await inviaRichiesta('PATCH', '/api/addLike', { id });
    if (response) {
      console.log(response);
      lstRegioni.trigger('change');
    }
  }
};
