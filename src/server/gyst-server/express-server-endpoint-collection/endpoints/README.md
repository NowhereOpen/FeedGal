2020-04-30 11:47

Follow how Nuxt `pages` directory is structured. So, endpoints may have directories that the website has, for example, `/dev` directory is only available on the server side as an API endpoint.

This way it has the same problem AND the same solution for Nuxt `pages` directory when renaming the url and stuff.

2020-04-29 10:33

Wanted to have all the end points in the same level instead of grouping the end points with same url in a same directory. But this kind of structure has a problem when changing the url name. Changing url name shouldn't happen frequently, but when it does, it will be a hassle to update the file/directory names for the end points.

Most importantly, one can see all the end points in the setup method of `.../endpoints/index.ts`. I used to have it so that urls with same name have their own setup functions, but I don't think this is as necessary.

So, we drop that from the old version, we keep the "end points with same (significant) url papth" from the old version.