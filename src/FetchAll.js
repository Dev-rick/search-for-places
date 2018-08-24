export const fetchInformation = (place) =>
  fetch(`https://api.foursquare.com/v2/venues/explore?client_id=HIKX4OSZLPNIZN3WKAWNLD40324TK5KER2CA3AZOB0RWMJEX&client_secret=CS5MG5L44UGSIHOADR00UF410EKUYZTUTVGTAB3SVLDKM0H0&v=20180323&limit=1&ll=${place.location.lat},${place.location.lng}`)
    .then(response => response.json())
    .catch(error => console.log(error));
