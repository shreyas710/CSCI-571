interface SelectedArtist {
  biography: string;
  birthday: string;
  created_at: string;
  deathday: string;
  gender: null;
  hometown: null;
  id: string;
  image_versions: string[];
  location: string;
  name: string;
  nationality: string;
  slug: string;
  sortable_name: string;
  target_supply: boolean;
  updated_at: string;
  _links: Links;
  isFavorite?: boolean;
}

interface Links {
  artworks: ResourceLink;
  genes: ResourceLink;
  image: ImageLink;
  permalink: ResourceLink;
  published_artworks: ResourceLink;
  self: ResourceLink;
  similar_artists: ResourceLink;
  similar_contemporary_artists: ResourceLink;
  thumbnail: ResourceLink;
}

interface ResourceLink {
  href: string;
}

interface ImageLink extends ResourceLink {
  templated: boolean;
}

export default SelectedArtist;
