import { useRef, Dispatch, SetStateAction } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';


type Props = {
    setSurveyInfo: (fill: any) => void;
    setSubmitted: Dispatch<SetStateAction<boolean>>;
}

type Inputs = {
    hhSize: number;
    numComputers: number;
    address: string;
    city: string;
    zip: number;
}

export default function Survey({setSurveyInfo, setSubmitted}: Props) {
  const htmlForm = useRef<HTMLFormElement | null>(null);
  const {register, handleSubmit, formState: { errors },} = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setSurveyInfo(data); 
    alert('Survey submmitted');
    setSubmitted(true);
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-200 sm:text-4xl">
          Kauai Residents Survey
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-300">
          This info will give us a better understanding of broadband service across the island.
        </p>
      </div>
      <form
        ref={htmlForm}
        action="#"
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-8 max-w-xl sm:mt-12"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="hhSize"
              className="block text-sm font-semibold leading-6 text-gray-200"
            >
              Number of people in household
            </label>
            <div className="mt-2.5">
              <input
                type="number"
               {...register("hhSize", { required: true, max: 99, min: 0})}
                id="hhSize"

                autoComplete="off"
                className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="numComputers"
              className="block text-sm font-semibold leading-6 text-gray-200"
            >
              Number of computers in household
            </label>
            <div className="mt-2.5">
              <input
                type="number"
               {...register("numComputers", { required: true, max: 99, min: 0})}
                id="numComputers"
                autoComplete="off"
                className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-semibold leading-6 text-gray-200"
            >
              Street address
            </label>
            <div className="mt-2.5">
              <input
                type="text"
               {...register("address", { required: true})}
                id="address"
                autoComplete="street-address"
                className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="city"
              className="block text-sm font-semibold leading-6 text-gray-200"
            >
              City
            </label>
            <div className="mt-2.5">
              <input
                type="text"
               {...register("city", { required: true, pattern: /[A-Z,a-z]{3,}/})}
                id="city"
                autoComplete="address-level2"
                className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="zip"
              className="block text-sm font-semibold leading-6 text-gray-200"
            >
              Zip Code
            </label>
            <div className="mt-2.5">
              <input
                type="text"
               {...register("zip", { required: true, pattern: /(967)\d{2}/, maxLength: 5})}
                id="zip"
                autoComplete="postal-code"
                className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                required
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
