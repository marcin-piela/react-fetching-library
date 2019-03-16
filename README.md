<p align="center">
	<a target="_blank" href="https://github.com/marcin-piela/react-fetching-library">
        <img src="/docs/_media/logo.png" />
    </a>
</p>
<p >
Simple and powerful fetching library for React. 

[![Watch on GitHub][github-watch-badge]][github-watch][![Star on GitHub][github-star-badge]][github-star][![Tweet][twitter-badge]][twitter]

</p>

---

[![Build Status][build-badge]][build] [![version][version-badge]][package] ![downloads][downloads-badge] [![MIT License][license-badge]][license] [![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc] ![Code of Conduct][gzip-badge]

✅ Zero dependencies (react, react-dom as peer deps)

✅ Provides hooks and HOCs

✅ Uses native fetch

✅ Request and response interceptors allows to customize all requests/responses (add authorization, refresh token etc) 

✅ React suspense support 

✅ TypeScript support 

✅ 2.2k minizipped

✅ Provides simple cache mechanism

---

# react-fetching-library


Use hooks or HOCs to fetch data in easy way. No dependencies! Just React under the hood.

Request and response interceptors allows you to easily customize connection with API (add authorization, refresh token, cache etc).

Library allows you to use it with connection of React Suspense ([read more about React Suspense](https://blog.logrocket.com/async-rendering-in-react-with-suspense-5d0eaac886c8)) to easily maintain loading state in application.

## Short example of use

```js
import { useQuery } from 'react-fetching-library';

const fetchUsersList = {
  method: 'GET',
  endpoint: '/users',
};

export const UsersListContainer = () => {
  const { loading, payload, error, query } = useQuery(fetchUsersList);

  return <UsersList loading={loading} error={error} users={payload} onReload={query} />;
};
```

[![Edit Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/marcin-piela/react-fetching-library/tree/master/examples/use-query-hook)

## Documentation

Full documentation is available at https://marcin-piela.github.io/react-fetching-library

## Contributing

Fell free to open PRs and issues to make this library better !

When making a PR, make sure all tests passes. If you add a new feature, please consider updating the documentation or codesandbox exampes. Thank you!

## License

react-fetching-library is licensed under the [MIT license](http://opensource.org/licenses/MIT).

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/marcin-piela/react-fetching-library.svg?style=flat-square
[build]: https://travis-ci.org/marcin-piela/react-fetching-library
[version-badge]: https://img.shields.io/npm/v/react-fetching-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-fetching-library
[downloads-badge]: https://img.shields.io/npm/dm/react-fetching-library.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/react-fetching-library.svg?style=flat-square
[license]: https://github.com/marcin-piela/react-fetching-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/marcin-piela/react-fetching-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/marcin-piela/react-fetching-library.svg?style=social
[github-watch]: https://github.com/marcin-piela/react-fetching-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/marcin-piela/react-fetching-library.svg?style=social
[github-star]: https://github.com/marcin-piela/react-fetching-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20react-fetching-library%20https%3A%2F%2Fgithub.com%2Fmarcin-piela%2Freact-fetching-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/marcin-piela/react-fetching-library.svg?style=social
[gzip-badge]:https://badgen.net/bundlephobia/minzip/react-fetching-library