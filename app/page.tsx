import Header from "@/app/components/Header";
import SearchCard from "@/app/components/SearchCard";
import PromoCard from "@/app/components/PromoCard";
import Footer from "@/app/components/Footer";


export default function Page() {
return (
<>
<Header />


{/* Hero */}
<section className="mx-auto max-w-6xl px-4 pt-10 pb-8 text-center">
<div className="mx-auto mb-2 w-12 h-12 rounded-full bg-blue-600/90" />
<h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight">NSU Fall 2025</h1>
<p className="mt-5 text-sm text-neutral-600 dark:text-neutral-300">Admission Results Portal</p>
<p className="mt-5 max-w-xl mx-auto text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
Check your admission test results instantly. Enter your test pass number below to view your comprehensive results across all subject choices.
</p>
</section>


{/* Search card */}
<div className="py-2">
<SearchCard />
</div>


{/* Promo card */}
<div className="py-10">
<PromoCard />
</div>


<Footer />
</>
);
}