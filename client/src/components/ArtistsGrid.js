import { StyledGrid } from '../styles';

const ArtistsGrid = ({ artists }) => {
  return (
    <>
      {artists && artists.length ? (
        <StyledGrid type="artist">
          {artists.map((artist, i) => (
            <li className="grid__item" key={i}>
              <div className="grid__item__inner">
                {artist.images[0] && (
                  <div className="grid__item__img">
                    <img src={artist.images[0].url} alt={artist.name} />
                  </div>
                )}
                <div className="grid__item__name overflow-ellipsis">
                  {artist.name}
                </div>
                <p className="grid__item__label">Artist</p>
              </div>
            </li>
          ))}
        </StyledGrid>
      ) : (
        <p className="empty-notice">No Aritsts Available</p>
      )}
    </>
  );
};

export default ArtistsGrid;
