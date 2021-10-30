import { useState, useEffect } from 'react';
import { ArtistsGrid, SectionWrapper, TimeRangeButtons } from '../components';
import { getCurrentUserTopArtists } from '../spotify';
import { catchErrors } from '../utils';

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const userTopArtists = await getCurrentUserTopArtists(
        `${activeRange}_term`,
      );
      setTopArtists(userTopArtists.data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      {topArtists && (
        <SectionWrapper title="Top Artists" breadcrumb="true">
          <TimeRangeButtons
            activeRange={activeRange}
            setActiveRange={setActiveRange}
          />
          <ArtistsGrid artists={topArtists.items} />
        </SectionWrapper>
      )} 
    </main>
  );
};

export default TopArtists;
