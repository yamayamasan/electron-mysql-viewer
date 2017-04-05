let tag = {
  prev: null,
  cur: null,
};
const target = 'div#container';

function routeUp(to, params) {
  const prev = tag.cur || null;
  if (prev) prev[0].unmount(true);
  const cur = riot.mount(target, to, { params });
  tag.prev = prev;
  tag.cur = cur;
}

const routing = [
  { tag: 'top', path: '/' },
  { tag: 'connection-edit', path: '/connections/edit/:id/' },
  { tag: 'operation', path: '/operation/:id/' },
  { tag: 'dashboard', path: '/dashboard/:id/' },
];


routing.forEach((r) => {
  const variables = r.path.match(/(\/:.+?\/)|(\/:.+$)/g);
  const params = [];
  if (variables) {
    variables.forEach((variable, idx) => {
      const key = variable.replace(/\/|:/g, '');
      params.push({
        key,
        idx
      });
    });
    r.path = r.path.replace(/(\/:.+?\/)|(\/:.+$)/g, '/*/');
  }
  route(r.path, function() {
    const input = {};
    if (params && params.length > 0) {
      params.forEach((param) => {
        input[param.key] = arguments[param.idx];
      });
    }
    routeUp(r.tag, input);
  });
});

// default
routeUp('top');
route.start();

/*
router.routes([
  new Router.Route({ tag: 'top', path: '/' }),
  new Router.Route({ tag: 'connection-edit', path: '/connections/edit' }),
  new Router.Route({ tag: 'operation', path: '/operation' }),
  new Router.DefaultRoute({ tag: 'top' })
])
riot.mount('*');
router.start();
*/