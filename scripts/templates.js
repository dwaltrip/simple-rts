
var Templates = {
  unitDetails: Handlebars.compile([
    '<div class="unit-details">',
      '<div>Name: {{unit.name}}</div>',
      '<div>Id: {{unit.id}}</div>',
      '<div>Coords: {{unit.coords}}</div>',
    '</div>'
  ].join('\n'))
};
