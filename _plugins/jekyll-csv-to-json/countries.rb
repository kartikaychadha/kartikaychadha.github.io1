module CsvToJson
  class Generator < Jekyll::Generator
    def generate_countries(site, place_files, movement_files)

      data = Hash.new()
      data['type'] = "FeatureCollection"
      data['features'] =[]

      place_files.each do |entry, index|
        path = File.join(site.source, @csv_dir, entry)
        next if File.symlink?(path) && site.safe
        # key = sanitize_filename(File.basename(entry, '.*')).
        table = CSV.read(path, :headers => true)

        index = 0
        table.to_a[1..-1].each do | row|
          row.each do | col |

            city = table[index]['City'].to_s

            country = table[index]['Country'].to_s

            data['features'][index]= {
              "type"=> "Feature",
              "id"=> index +1.to_i,
              "geometry"=> {
                "type"=> "Point",
                "coordinates"=> [
                  table[index]['Long'].to_f,
                  table[index]['Lat'].to_f,
                ]
              },
              "properties"=> {
                "type"=> "Sovereign country",
                "country"=> country,
                "country_downcase"=> country.downcase,
                "city"=> city,
                "city_downcase"=> city.downcase,
                "PlaceID" => "#{city}_#{country}".downcase,
                "city"=> city,
                "region"=> table[index]['Region'].to_s,
                "placeName"=> table[index]['PlaceName'].to_s,
                "popupContent" => "done ",
                "underConstruction": false
              }
            }
          end
          index+=1
        end
      end
      # save(site, 'countries', pretty_print(data.to_h.to_json))
    end
  end
end
