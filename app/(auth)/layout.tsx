import Image from "next/image";

const AuthLayout = (
    {children}:
    {children : React.ReactNode}
) => {
    return ( 
        <div className="flex min-h-screen w-full bg-slate-50">
            {/* Left Panel: Brand & Illustration (Hidden on mobile) */}
            <div className="relative flex max-md:hidden w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 text-white lg:w-3/5 overflow-hidden">
                {/* Decorative background overlay pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Top: Logo & Title */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
                        <Image
                            src="/logo1.png"
                            alt="Roboautomators Logo"
                            width={28}
                            height={28}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                        Roboautomators
                    </span>
                </div>

                {/* Center: Illustration & Copy */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
                    {/* Animated Float Container */}
                    <div className="animate-float relative aspect-video w-full max-w-[480px] overflow-hidden rounded-3xl bg-white/5 p-4 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-white/20">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                            <Image
                                src="/assets/images/login_illustration.png"
                                alt="Kid and Robot Learning illustration"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <h2 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-4xl">
                        Let's learn something new today!
                    </h2>
                    <p className="mt-3 max-w-md text-base text-indigo-100 font-medium">
                        Jump into coding, robotics, and creative building. Your next automation adventure starts here! 🚀🤖
                    </p>
                </div>

                {/* Bottom: Footer Info */}
                <div className="relative z-10 text-xs text-white/50 font-medium">
                    © {new Date().getFullYear()} Roboautomators. All rights reserved.
                </div>
            </div>

            {/* Right Panel: Sign-In / Sign-Up Form */}
            <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2 lg:w-2/5 relative">
                {/* Soft background glow on mobile */}
                <div className="absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-200/20 blur-3xl md:hidden" />
                <div className="absolute bottom-1/4 right-1/4 -z-10 h-64 w-64 rounded-full bg-pink-200/20 blur-3xl md:hidden" />

                <div className="w-full max-w-md flex flex-col items-center justify-center">
                    {/* Small logo for mobile views */}
                    <div className="flex md:hidden items-center gap-2 mb-8">
                        <Image
                            src="/logo1.png"
                            alt="Roboautomators Logo"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                        <span className="text-2xl font-bold tracking-tight text-slate-800">
                            Roboautomators
                        </span>
                    </div>

                    <div className="w-full flex justify-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;