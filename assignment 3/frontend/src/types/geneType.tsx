interface GeneCategory {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  display_name: string;
  description: string;
  image_versions: string[];
  _links: {
    thumbnail: {
      href: string;
    };
    image: {
      href: string;
      templated: boolean;
    };
    self: {
      href: string;
    };
    permalink: {
      href: string;
    };
    artworks: {
      href: string;
    };
    published_artworks: {
      href: string;
    };
    artists: {
      href: string;
    };
  };
}

export default GeneCategory;
