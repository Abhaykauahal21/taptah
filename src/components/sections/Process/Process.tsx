import React from "react";
import Image from "next/image";
import { InView } from "@/components/common/InView";
import { PROCESS_STEPS } from "@/constants/process";
import { BlurredFoliage } from "./BlurredFoliage";
import { BowlLeavesBehind, BowlLeavesFront } from "./BowlLeaves";
import { GrainFlow } from "./GrainFlow";
import { KadayiFire } from "./KadayiFire";
import { ProcessGround } from "./ProcessGround";
import { ProcessMobile } from "./ProcessMobile";

export const Process: React.FC = () => {
  return (
    <section
      id="process"
      aria-label="The Taptah Process"
      className="relative z-10 overflow-x-clip px-5 pb-16 pt-4 text-maroon sm:px-8 lg:-mt-[14vw] lg:-mb-[min(30vw,450px)] lg:px-0 lg:pb-0 lg:pt-0"
    >
      <BlurredFoliage />
      {/* Phones and tablets get their own vertical layout */}
      <ProcessMobile />
      <InView className="process-art mx-auto hidden max-w-[1500px] lg:relative lg:block lg:aspect-[1258/1100]">
        {/* Studio glow and cast shadows that give the vessels depth */}
        <ProcessGround />

        {/* Naturally-grown cut-out: jowar, grain stream and scoop */}
        <div className="process-flow relative mx-auto w-full max-w-md lg:absolute lg:left-[24%] lg:top-[-8%] lg:mx-0 lg:w-[24%] lg:max-w-none">
          <Image
            loading="eager"
            src="/images/why/naturally-grown-clean.png"
            alt=""
            aria-hidden="true"
            width={1396}
            height={1127}
            sizes="(min-width: 1024px) 24vw, 0px"
            className="process-cast process-cast-air pointer-events-none absolute inset-0 hidden h-full w-full select-none lg:block"
          />
          <Image
            loading="eager"
            src="/images/why/naturally-grown-clean.png"
            alt="Jowar stalks with a stream of grains pouring from a wooden scoop"
            width={1396}
            height={1127}
            sizes="(min-width: 1024px) 24vw, 90vw"
            className="h-auto w-full"
          />
        </div>

        <BowlLeavesBehind />

        {/* Step 02: cleaned grains pouring into a bowl, continuing the flow */}
        <div
          className="process-flow relative mx-auto mt-8 w-full max-w-md lg:absolute lg:left-[35%] lg:top-[8%] lg:mx-0 lg:mt-0 lg:w-[22%] lg:max-w-none"
          style={{ transitionDelay: "0.5s" }}
        >
          <Image
            loading="eager"
            src="/images/why/step-2-bowl-empty.png"
            alt=""
            aria-hidden="true"
            width={1492}
            height={1054}
            sizes="(min-width: 1024px) 22vw, 0px"
            className="process-cast process-cast-floor pointer-events-none absolute inset-0 hidden h-full w-full select-none lg:block"
          />
          <Image
            loading="eager"
            src="/images/why/step-2-bowl-empty.png"
            alt="Cleaned jowar grains pouring into a wooden bowl"
            width={1492}
            height={1054}
            sizes="(min-width: 1024px) 22vw, 90vw"
            className="h-auto w-full"
          />
        </div>

        <BowlLeavesFront />

        {/* Step 03: slow-cooking kadayi on a clay chulha */}
        <div
          className="process-flow relative mx-auto mt-8 w-full max-w-md lg:absolute lg:left-[52%] lg:top-[25%] lg:mx-0 lg:mt-0 lg:w-[19%] lg:max-w-none"
          style={{ transitionDelay: "1s" }}
        >
          <Image
            loading="eager"
            src="/images/why/kadayi.png"
            alt=""
            aria-hidden="true"
            width={1419}
            height={1108}
            sizes="(min-width: 1024px) 19vw, 0px"
            className="process-cast process-cast-floor pointer-events-none absolute inset-0 hidden h-full w-full select-none lg:block"
          />
          <Image
            loading="eager"
            src="/images/why/kadayi.png"
            alt="Copper kadayi on a clay stove with a wood fire burning below"
            width={1419}
            height={1108}
            sizes="(min-width: 1024px) 19vw, 90vw"
            className="h-auto w-full"
          />
          <KadayiFire />
        </div>

        {/* Step 04: second bowl and the masala shaker */}
        <div
          className="process-flow relative mx-auto mt-8 w-full max-w-md lg:absolute lg:left-[63%] lg:top-[48%] lg:mx-0 lg:mt-0 lg:w-[22%] lg:max-w-none"
          style={{ transitionDelay: "1.3s" }}
        >
          <Image
            loading="eager"
            src="/images/why/step-2-bowl-empty.png"
            alt=""
            aria-hidden="true"
            width={1492}
            height={1054}
            sizes="(min-width: 1024px) 22vw, 0px"
            className="process-cast process-cast-floor pointer-events-none absolute inset-0 hidden h-full w-full select-none lg:block"
          />
          <Image
            loading="eager"
            src="/images/why/step-2-bowl-empty.png"
            alt="A wooden bowl catching freshly popped, masala-coated jowar"
            width={1492}
            height={1054}
            sizes="(min-width: 1024px) 22vw, 90vw"
            className="h-auto w-full"
          />
        </div>
        {/* Step 04b: third bowl (pudina) and its shaker */}
        <div
          className="process-flow relative mx-auto mt-8 w-full max-w-md lg:absolute lg:left-[39%] lg:top-[48%] lg:mx-0 lg:mt-0 lg:w-[22%] lg:max-w-none"
          style={{ transitionDelay: "1.45s" }}
        >
          <Image
            loading="eager"
            src="/images/why/step-2-bowl-empty.png"
            alt=""
            aria-hidden="true"
            width={1492}
            height={1054}
            sizes="(min-width: 1024px) 22vw, 0px"
            className="process-cast process-cast-floor pointer-events-none absolute inset-0 hidden h-full w-full select-none lg:block"
          />
          <Image
            loading="eager"
            src="/images/why/step-2-bowl-empty.png"
            alt="A wooden bowl catching pudina-flavoured pop jowar"
            width={1492}
            height={1054}
            sizes="(min-width: 1024px) 22vw, 90vw"
            className="h-auto w-full"
          />
        </div>
        {[
          { left: "40.6%", flip: false },
          { left: "55.4%", flip: true },
        ].map((b) => (
          <div
            key={b.left}
            className="process-flow absolute z-10 hidden lg:block"
            style={{ left: b.left, top: "44.9%", width: "5%", transitionDelay: "1.7s" }}
          >
            <Image
              loading="eager"
              src="/images/why/podina-masalla-bottle.png"
              alt="Pudina Masalle spice shaker"
              width={1024}
              height={1536}
              sizes="6vw"
              className={
                "masala-shaker h-auto w-full drop-shadow-[4px_8px_6px_rgba(40,20,5,0.35)] " +
                (b.flip ? "masala-shaker-right" : "")
              }
            />
          </div>
        ))}

        {[
          { left: "64.6%", flip: false },
          { left: "79.4%", flip: true },
        ].map((b) => (
          <div
            key={b.left}
            className="process-flow absolute z-10 hidden lg:block"
            style={{ left: b.left, top: "44.9%", width: "5%", transitionDelay: "1.6s" }}
          >
            <Image
              loading="eager"
              src="/images/why/masala-bottle.png"
              alt="Special Masalle spice shaker"
              width={1024}
              height={1536}
              sizes="6vw"
              className={
                "masala-shaker h-auto w-full drop-shadow-[4px_8px_6px_rgba(40,20,5,0.35)] " +
                (b.flip ? "masala-shaker-right" : "")
              }
            />
          </div>
        ))}

        {/* Grains spill from the scoop, heap up in the bowl and overflow */}
        <GrainFlow />

        {/* Copy */}
        <div data-parallax="0.05" className="process-copy mt-10 lg:absolute lg:left-[5.3%] lg:top-[3%] lg:mt-0 lg:w-[36%]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#6B1022]/80 sm:text-xs">
            The Taptah Process
          </p>
          <h2 className="mt-5 text-[clamp(2.5rem,4.6vw,4.5rem)] font-semibold leading-[1.06] tracking-tight text-[#6B1022]">
            From Ancient
            <br />
            Grains to
            <br />
            Your Favourite
            <br />
            Crunch.
          </h2>
          <p className="mt-6 max-w-[26rem] text-[clamp(1.05rem,1.3vw,1.25rem)] font-medium leading-[1.55] text-[#3a2a24]">
            Every pack of Taptah Pop Jowar goes through a thoughtful journey —
            from our fields to your hands, with purity, care and the flavour of
            tradition.
          </p>
        </div>

        {/* Desktop: step labels float along the flow */}
        {PROCESS_STEPS.map((step, i) => (
          <div
            key={step.step}
            className="process-step absolute hidden w-[16%] max-w-[240px] lg:block"
            style={
              {
                left: `${step.position.left}%`,
                top: `${step.position.top}%`,
                "--step-delay": `${0.9 + i * 0.25}s`,
              } as React.CSSProperties
            }
          >
            <StepLabel {...step} />
          </div>
        ))}

        {/* Mobile / tablet: labels listed below */}
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:hidden">
          {PROCESS_STEPS.map((step) => (
            <li key={step.step}>
              <StepLabel {...step} />
            </li>
          ))}
        </ol>
      </InView>
    </section>
  );
};

function StepLabel({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <>
      <span className="text-[clamp(1.1rem,1.45vw,1.4rem)] font-semibold text-[#6B1022]">
        {String(step).padStart(2, "0")}
      </span>
      <h3 className="mt-0.5 text-[clamp(1.05rem,1.45vw,1.4rem)] font-semibold leading-tight text-[#6B1022]">
        {title}
      </h3>
      <p className="mt-1.5 text-[clamp(0.9rem,1vw,1rem)] font-medium leading-snug text-[#5a463c]">
        {description}
      </p>
    </>
  );
}
