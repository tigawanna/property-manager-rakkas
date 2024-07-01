import type { PageProps } from "rakkasjs";
export default function AboutPage({}: PageProps) {
  return (
    <div className="w-full h-full min-h-[99vh]  flex flex-col font-serif justify-center items-center ">
      <div className="flex flex-col h-full gap-5 w-full  lg:max-w-[90%] p-5">
        <h2 className="text-lg md:text-3xl font-bold  ">
          Welcome to Lavington drinks!
        </h2>
        <div className="flex  flex-col h-full gap-5 md:flex-row md:space-x-8">
          <img
            className="object-cover w-full h-64 rounded-lg md:w-1/2"
            src="/hero-image-mobile.webp"
            alt="Lavington Liquor Store Facade"
          />
          <div className="flex flex-col gap-1 space-y-2 md:w-1/2 text-sm">
            <p className="">
              We are your one-stop shop for all your liquor and beverage needs
              in Lavington, Kenya.
            </p>
            <p className="">
              Whether you're a connoisseur of fine wines or simply looking for a
              refreshing drink, we offer a wide variety of products to satisfy
              your taste buds.
            </p>
            <br />
            We also deliver on
            <ul className="pl-[3%] list-disc">
              <li>Glovo</li>
              <li>Uber eats</li>
              <li>Little</li>
              <li>Jumia foods</li>
            </ul>
          </div>
        </div>

        <div className="px-5 lg:max-w-[70%] text-sm">
          <p>
            Lavington drinks has been a trusted name in the Lavington community
            for providing exceptional customer service and a curated selection
            of alcoholic beverages. We are passionate about helping our
            customers discover new favorites and find the perfect drinks for any
            occasion.
          </p>
          <br />
          <p>
            Our knowledgeable staff is always happy to assist you with your
            selections. We can offer recommendations based on your preferences
            and answer any questions you may have.
          </p>
        </div>
      </div>
    </div>
  );
}
