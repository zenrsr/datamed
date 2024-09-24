"use client";

import { Button } from "../ui/button";
import { BiCheck } from "react-icons/bi";

type ImageProps = {
  src: string;
  alt?: string;
};

type Feature = {
  icon: React.ReactNode;
  text: string;
};

type PricingPlan = {
  icon: ImageProps;
  planName: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: Feature[];
  buttonText: string;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  pricingPlans: PricingPlan[];
};

export type Pricing19Props = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const Pricing = (props: Pricing19Props) => {
  const { tagline, heading, description, pricingPlans } = {
    ...Pricing19Defaults,
    ...props,
  } as Props;
  return (
    <section
      id="pricing"
      className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 bg-brand-white w-full"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <p className="text-sm font-semibold uppercase mb-3 md:mb-4">
            {tagline}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            {heading}
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingPlan key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingPlan = ({ plan }: { plan: PricingPlan }) => (
  <div className="flex flex-col justify-between p-6 md:p-8 border border-gray-200 rounded-lg shadow-sm">
    <div>
      <div className="flex justify-end mb-4">
        <img src={plan.icon.src} alt={plan.icon.alt} className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-bold mb-2">{plan.planName}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{plan.monthlyPrice}</span>
        <span className="text-xl">/mo</span>
      </div>
      <p className="text-sm text-gray-600 mb-6">or {plan.yearlyPrice} yearly</p>
      <div className="border-t border-gray-200 my-6" />
      <p className="font-semibold mb-4">Includes:</p>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2 text-green-500">{feature.icon}</span>
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
    <Button variant="outline" className="w-full">
      {plan.buttonText}
    </Button>
  </div>
);

export const Pricing19Defaults: Pricing19Props = {
  tagline: "Plans that best suit your interests",
  heading: "Pricing plans",
  description: "Choose the perfect plan for your needs. No hidden fees.",
  pricingPlans: [
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Basic plan icon",
      },
      planName: "Basic plan",
      monthlyPrice: "$19",
      yearlyPrice: "$199",
      features: [
        { icon: <BiCheck className="w-5 h-5" />, text: "Feature 1" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Feature 2" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Feature 3" },
      ],
      buttonText: "Get started",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Pro plan icon",
      },
      planName: "Pro plan",
      monthlyPrice: "$49",
      yearlyPrice: "$499",
      features: [
        { icon: <BiCheck className="w-5 h-5" />, text: "All Basic features" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Pro feature 1" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Pro feature 2" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Pro feature 3" },
      ],
      buttonText: "Get started",
    },
    {
      icon: {
        src: "https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg",
        alt: "Enterprise plan icon",
      },
      planName: "Enterprise plan",
      monthlyPrice: "$99",
      yearlyPrice: "$999",
      features: [
        { icon: <BiCheck className="w-5 h-5" />, text: "All Pro features" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Enterprise feature 1" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Enterprise feature 2" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Enterprise feature 3" },
        { icon: <BiCheck className="w-5 h-5" />, text: "Enterprise feature 4" },
      ],
      buttonText: "Contact sales",
    },
  ],
};
