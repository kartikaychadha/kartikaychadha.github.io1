

module CsvToJson
    class Generator < Jekyll::Generator

        def generate_author(site, movement_files)

            data = Hash.new
            movement_files.each do |entry|
                file_data = read_csv(site, entry)
                #author_values
                key = file_data.headers[1].gsub(' ', '')
                value = entry.gsub('movements/', '').gsub(' - MAIN.csv', '')
                
                data[key] = value
            end
            save(site, "author", pretty_print(data.sort.to_h.to_json))   
        end
    end
end
