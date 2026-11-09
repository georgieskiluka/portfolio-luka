import PortfolioApp from "@/components/portfolio/PortfolioApp";
import { getCardEndorsements } from "@/lib/endorsements/store";

// Approving an endorsement refreshes the page immediately; this is only a backstop.
export const revalidate = 3600;

export default async function Home() {
  return <PortfolioApp approved={await getCardEndorsements()} />;
}
