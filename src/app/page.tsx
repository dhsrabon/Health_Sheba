import HeroBanner from '@/components/shared/HeroBanner';
import TopDoctors from '@/components/shared/TopDoctors';
import HealthTips from '@/components/shared/HealthTips';
import Footer from '@/components/shared/Footer';
import ExtraSections from '@/components/ExtraSections';
export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <HeroBanner />
      <TopDoctors />
      <ExtraSections />
      <HealthTips />
      <Footer />
      {/* পরবর্তীতে Health Tips বা Footer এখানে আসবে */}
    </main>
  );
}