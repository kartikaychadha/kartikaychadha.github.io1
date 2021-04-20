module CsvToJson
    class Generator < Jekyll::Generator

        def generate_place(site, place_files)

            data = Hash.new()
            place_files.each do |entry, index|

                table = read_csv(site, entry)
                i = 0
                table.to_a[1..-1].each do | row|
                    row.each do | col |

                        city = table[i]['City'].to_s
                        country = table[i]['Country'].to_s
                        placeId = city + "_" + country

                        data[placeId.to_s.downcase]= {
                            "City": city.to_s,
                            "Country": country.to_s,
                            "Lat": table[i]['Lat'].to_f,
                            "Long": table[i]['Long'].to_f,
                            "PlaceID": placeId.downcase,
                            "PlaceName": table[i]['PlaceName'].to_s,
                            "Region": table[i]['Region'].to_s,
                        }
                    end
                    i+=1
                end
            end
            save(site, 'places', pretty_print(data.to_h.to_json))
        end
    end
end
  