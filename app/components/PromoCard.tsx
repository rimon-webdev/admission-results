import Image from "next/image";


export default function PromoCard() {
return (
<section className="mx-auto max-w-4xl w-full px-4">
<div className="rounded-2xl border border-neutral-200/70 dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] p-6 sm:p-8 text-center">
<div className="mx-auto mb-3 w-10 h-10 rounded-full bg-red-600/90" />
<h3 className="text-xl font-bold">Worried About Private University Admission?</h3>
<div className="mt-5">
{/* Replace promo.jpg with your own image */}
<div className="relative mx-auto aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
<Image src="/promo.jpg" alt="Promo" fill className="object-cover" />
</div>
</div>
<div className="mt-4 flex flex-wrap justify-center gap-2 text-[12px]">
{["NSU","EWU","BRACU","IUB","AIUB","AUB"].map(t => (
<span key={t} className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-red-600 dark:bg-white/5">{t}</span>
))}
</div>
<p className="mt-6 text-sm text-neutral-600 dark:text-neutral-300 mx-auto max-w-2xl">
Privatune is your go-to platform for navigating private university admissions in Bangladesh. We provide expert guidance, personalized strategies, and in-depth insights to help students make informed choices and secure a bright academic future.
</p>
<div className="mt-8 flex justify-center gap-3">
<a href="https://qedlearning.com/product-category/course/" target="_blank" className="inline-flex items-center rounded-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700">Explore Our Courses</a>
<a href="#" className="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-semibold">Success Stories</a>
</div>
</div>
</section>
);
}