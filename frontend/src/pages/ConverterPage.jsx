import { useState } from "react";
import Area from "../assets/area.png";

const AreaConverter = () => {
    const [areaValues, setAreaValues] = useState({
        ropani: "",
        aana: "",
        paisa: "",
        daam: "",
        bigha: "",
        kattha: "",
        dhur: "",
        sqFeet: "",
        sqMeter: "",
    });

    const handleChange = (e, key) => {
        const inputValue = e.target.value;

        // Allow empty input for the field being edited
        let value = inputValue === "" ? "" : parseFloat(inputValue) || 0;

        // Ensure that when the value is "0", it is set as a valid number
        if (inputValue === "0") {
            value = 0;
        }

        // Create a new state object but only update the field being changed
        const updatedValues = { ...areaValues, [key]: value };

        // Perform calculations only based on the edited field
        if (key === "ropani") {
            updatedValues.aana = value * 16;
            updatedValues.paisa = value * 64;
            updatedValues.daam = value * 256;
            updatedValues.bigha = value / 13.31;
            updatedValues.kattha = updatedValues.bigha * 20;
            updatedValues.dhur = updatedValues.kattha * 20;
            updatedValues.sqMeter = value * 508.72;
            updatedValues.sqFeet = value * 5476;
        } else if (key === "aana") {
            updatedValues.ropani = value / 16;
            updatedValues.paisa = value * 4;
            updatedValues.daam = value * 16;
            updatedValues.bigha = updatedValues.ropani / 13.31;
            updatedValues.kattha = updatedValues.bigha * 20;
            updatedValues.dhur = updatedValues.kattha * 20;
            updatedValues.sqMeter = updatedValues.ropani * 508.72;
            updatedValues.sqFeet = updatedValues.ropani * 5476;
        } else if (key === "paisa") {
            updatedValues.ropani = value / 64;
            updatedValues.aana = value / 4;
            updatedValues.daam = value * 4;
            updatedValues.bigha = updatedValues.ropani / 13.31;
            updatedValues.kattha = updatedValues.bigha * 20;
            updatedValues.dhur = updatedValues.kattha * 20;
            updatedValues.sqMeter = updatedValues.ropani * 508.72;
            updatedValues.sqFeet = updatedValues.ropani * 5476;
        } else if (key === "daam") {
            updatedValues.ropani = value / 256;
            updatedValues.aana = value / 16;
            updatedValues.paisa = value / 4;
            updatedValues.bigha = updatedValues.ropani / 13.31;
            updatedValues.kattha = updatedValues.bigha * 20;
            updatedValues.dhur = updatedValues.kattha * 20;
            updatedValues.sqMeter = updatedValues.ropani * 508.72;
            updatedValues.sqFeet = updatedValues.ropani * 5476;
        } else if (key === "bigha") {
            updatedValues.kattha = value * 20;
            updatedValues.dhur = updatedValues.kattha * 20;
            updatedValues.ropani = value * 13.31;
            updatedValues.aana = updatedValues.ropani * 16;
            updatedValues.paisa = updatedValues.ropani * 64;
            updatedValues.daam = updatedValues.ropani * 256;
            updatedValues.sqMeter = value * 6772.63;
            updatedValues.sqFeet = value * 72900;
        } else if (key === "kattha") {
            updatedValues.bigha = value / 20;
            updatedValues.dhur = value * 20;
            updatedValues.ropani = updatedValues.bigha * 13.31;
            updatedValues.aana = updatedValues.ropani * 16;
            updatedValues.paisa = updatedValues.ropani * 64;
            updatedValues.daam = updatedValues.ropani * 256;
            updatedValues.sqMeter = updatedValues.ropani * 508.72;
            updatedValues.sqFeet = updatedValues.ropani * 5476;
        } else if (key === "dhur") {
            updatedValues.kattha = value / 20;
            updatedValues.bigha = updatedValues.kattha / 20;
            updatedValues.ropani = updatedValues.bigha * 13.31;
            updatedValues.aana = updatedValues.ropani * 16;
            updatedValues.paisa = updatedValues.ropani * 64;
            updatedValues.daam = updatedValues.ropani * 256;
            updatedValues.sqMeter = updatedValues.ropani * 508.72;
            updatedValues.sqFeet = updatedValues.ropani * 5476;
        } else if (key === "sqFeet") {
            updatedValues.sqMeter = value / 10.764;
            updatedValues.ropani = value / 5476;
            updatedValues.aana = updatedValues.ropani * 16;
            updatedValues.paisa = updatedValues.ropani * 64;
            updatedValues.daam = updatedValues.ropani * 256;
            updatedValues.bigha = updatedValues.ropani / 13.31;
            updatedValues.kattha = updatedValues.bigha * 20;
            updatedValues.dhur = updatedValues.kattha * 20;
        } else if (key === "sqMeter") {
            updatedValues.sqFeet = value * 10.764;
            updatedValues.ropani = value / 508.72;
            updatedValues.aana = updatedValues.ropani * 16;
            updatedValues.paisa = updatedValues.ropani * 64;
            updatedValues.daam = updatedValues.ropani * 256;
            updatedValues.bigha = updatedValues.ropani / 13.31;
            updatedValues.kattha = updatedValues.bigha * 20;
            updatedValues.dhur = updatedValues.kattha * 20;
        }

        setAreaValues(updatedValues);
    };

    return (
        <main className="w-full p-8 mt-28">
            <div className="max-w-4xl mx-auto space-y-14 mb-4">
                {/* Ropani System */}
                <section>
                    <h2 className="text-2xl font-medium text-gray-900 mb-4">
                        Ropani System
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {["ropani", "aana", "paisa", "daam"].map((key) => (
                            <div key={key}>
                                <label className="block text-gray-500 mb-1 capitalize">
                                    {key}
                                </label>
                                <input
                                    type="number"
                                    value={areaValues[key]}
                                    onChange={(e) => handleChange(e, key)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bigha System */}
                <section>
                    <h2 className="text-2xl font-medium text-gray-900 mb-4">
                        Bigha System
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {["bigha", "kattha", "dhur"].map((key) => (
                            <div key={key}>
                                <label className="block text-gray-500 mb-1 capitalize">
                                    {key}
                                </label>
                                <input
                                    type="number"
                                    value={areaValues[key]}
                                    onChange={(e) => handleChange(e, key)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feet/Meter */}
                <section>
                    <h2 className="text-2xl font-medium text-gray-900 mb-4">
                        Feet/Meter
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["sqFeet", "sqMeter"].map((key) => (
                            <div key={key}>
                                <label className="block text-gray-500 mb-1 capitalize">
                                    {key.replace("sq", "Sq. ")}
                                </label>
                                <input
                                    type="number"
                                    value={areaValues[key]}
                                    onChange={(e) => handleChange(e, key)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Information Section */}
            <section className="w-full py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
                        Area Converter Information
                    </h2>
                    <p className="text-lg text-gray-700 mb-6">
                        The following is a list of everyday units used to calculate land
                        area in Nepal.
                    </p>

                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Land Area Units in Nepal
                        </h3>
                        <ul className="text-lg text-gray-700 list-inside list-disc">
                            <li>
                                <strong>1 Bigha</strong> = 20 Kattha = 6772.63 m² = 72,900
                                sq.ft. = 13.31 Ropani
                            </li>
                            <li>
                                <strong>1 Katha</strong> = 20 Dhur = 338.63 m² = 3,645 sq.ft.
                            </li>
                            <li>
                                <strong>1 Dhur</strong> = 16.93 m² = 182.25 sq.ft.
                            </li>
                            <li>
                                <strong>1 Ropani</strong> = 16 Aana = 64 Paisa = 508.72 m² =
                                5,476 sq.ft. = 256 Daam = 4 llka
                            </li>
                            <li>
                                <strong>1 Aana</strong> = 4 Paisa = 31.80 m² = 342.25 sq. ft. =
                                16 Daam
                            </li>
                            <li>
                                <strong>1 Paisa</strong> = 4 Daam = 7.95 m² = 85.56 sq. ft.
                            </li>
                            <li>
                                <strong>1 Daam</strong> = 1.99 m² = 21.39 sq. ft.
                            </li>
                        </ul>
                        <p className="text-lg text-gray-700 text-justify">
                            The units of measurement of land area depend on the part of the
                            country where they are being used. The
                            Bigha-Katha-Dhur measurements are common in the
                            Terai region, while the
                            Ropani-Aana measurements are common in hilly and
                            mountainous regions.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
                        <div className="flex items-center space-x-8">
                            <div className="space-y-6 flex-1">
                                <h3 className="text-xl font-semibold text-gray-900">Conversion Rate</h3>
                                <ul className="text-lg text-gray-700 list-inside list-disc space-y-2">
                                    <li>
                                        <strong>1 Ropani</strong> = 74 feet x 74 feet
                                    </li>
                                    <li>
                                        <strong>1 Bigha</strong> = 13 Ropani
                                    </li>
                                    <li>
                                        <strong>1 Kattha</strong> = 442 square yards or 338 square meters
                                    </li>
                                </ul>
                            </div>
                            <div className="flex justify-center">
                                <img
                                    src={Area}
                                    alt="Area conversion"
                                    className="max-w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AreaConverter;
