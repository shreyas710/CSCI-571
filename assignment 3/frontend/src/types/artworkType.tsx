export interface Dimensions {
  text: string;
  height: number;
  width: number;
  depth: number | null;
  diameter: number | null;
}

export interface DimensionSet {
  in: Dimensions;
  cm: Dimensions;
}

export interface Links {
  thumbnail: {
    href: string;
  };
  image: {
    href: string;
    templated: boolean;
  };
  partner: {
    href: string;
  };
  self: {
    href: string;
  };
  permalink: {
    href: string;
  };
  genes: {
    href: string;
  };
  artists: {
    href: string;
  };
  similar_artworks: {
    href: string;
  };
  collection_users: {
    href: string;
  };
  sale_artworks: {
    href: string;
  };
}

export interface Embedded {
  editions: [];
}

export interface Artwork {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  title: string;
  category: string;
  medium: string;
  date: string;
  dimensions: DimensionSet;
  published: boolean;
  website: string;
  signature: string;
  series: string | null;
  provenance: string;
  literature: string;
  exhibition_history: string;
  collecting_institution: string;
  additional_information: string;
  image_rights: string;
  blurb: string;
  unique: boolean;
  cultural_maker: string | null;
  iconicity: number;
  can_inquire: boolean;
  can_acquire: boolean;
  can_share: boolean;
  sale_message: string | null;
  sold: boolean;
  visibility_level: string;
  image_versions: string[];
  _links: Links;
  _embedded: Embedded;
}

export default Artwork;