export function Goals() {
  return (
    <section className="container py-12 bg-[#1E2656]">
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">OUR GOALS</p>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Securing Your Digital
          <br />
          World Together
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-300">
          Empower businesses of all sizes with real-time monitoring, automated threat mitigation, and proactive
          vulnerability detection, all within a user-friendly and cost-effective solution.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl hover:shadow-[1px_1px_14px_1px_#15dffa] transition-all duration-300 bg-gray-900/40 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-4">Mission Statement</h3>
          <p className="text-gray-300">
            Our mission is to revolutionize website security by providing a unified, AI-driven platform that delivers
            comprehensive protection against cyber threats.
          </p>
        </div>

        <div className="rounded-2xl hover:shadow-[1px_1px_14px_1px_#15dffa] transition-all duration-300 bg-gray-900/40 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-4">Key Objectives</h3>
          <p className="text-gray-300">
            Empower businesses of all sizes with real-time monitoring, automated threat mitigation, and proactive
            vulnerability detection, all within a user-friendly and cost-effective solution.
          </p>
        </div>

        <div className="rounded-2xl hover:shadow-[1px_1px_14px_1px_#15dffa] transition-all duration-300 bg-gray-900/40 p-8 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-4">Client-Centric Approach</h3>
          <p className="text-gray-300">
            We focus on delivering advanced technologies and scalable security solutions tailored to meet the unique
            needs of every client, ensuring their digital safety and peace of mind.
          </p>
        </div>
      </div>
    </section>
  )
}

