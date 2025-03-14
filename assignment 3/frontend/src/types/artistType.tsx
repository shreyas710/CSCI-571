interface Artist {
  description: null | string;
  og_type: string;
  title: string;
  type: string;
  name?: string;
  id?: string;
  _links: {
    permalink: {
      href: string;
    };
    self: {
      href: string;
    };
    thumbnail: {
      href: string;
    };
  };
}

export default Artist;
