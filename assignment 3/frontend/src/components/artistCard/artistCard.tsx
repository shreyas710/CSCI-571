export default function ArtistCard({
  image,
  text,
}: {
  image: string;
  text: string;
}) {
  return (
    <div className='artist-card'>
      <img src={image} alt='Artist' className='artist-image' />
      <p className='artist-text'>{text}</p>
    </div>
  );
}
