export const HeroBanner = () => {
    return (
        <section id="home" className="relative h-screen w-full bg-[url('/assets/images/hero_banner.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
            {/* Dark overlay for better text readability against the cityscape */}
            <div className="absolute inset-0 bg-[#000000] opacity-60 z-0"></div>

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-700">
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-white uppercase tracking-tight drop-shadow-lg leading-tight">
                    Your Journey, <br className="hidden md:block" />
                    <span className="text-amber-accent">Your Choice</span>
                </h1>

                <p className="font-sans text-xl md:text-2xl text-light-gray max-w-2xl drop-shadow-md">
                    Experience seamless travels with Prakash Travel. Book your perfect ride from our premium fleet of cars and bikes today.
                </p>

                {/* <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto text-center justify-center">
                    <button className="bg-dynamic-orange hover:bg-amber-accent px-10 py-4 rounded-md font-sans text-white font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
                        BOOK NOW
                    </button>
                    <button className="bg-primary hover:bg-steel-blue px-10 py-4 rounded-md font-sans text-white font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-xl duration-300 border border-steel-blue/50">
                        VIEW FLEET
                    </button>
                </div> */}
            </div>

        </section>
    )
}