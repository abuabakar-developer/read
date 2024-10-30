import { useRouter } from 'next/router';
import ExploreBooks from '../components/ExploreBooks';

const ExploreCategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;

  return <ExploreBooks category={category as string} searchTerm="" />;
};

export default ExploreCategoryPage;








