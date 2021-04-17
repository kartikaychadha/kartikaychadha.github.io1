

 module CsvToJson

    class Generator < Jekyll::Generator

        def generate_author(site, movement_files)

            data = Hash.new
            movement_files.each do |entry|
            path = File.join(site.source, @csv_dir, entry)
            next if File.symlink?(path) && site.safe

            #csv file data csv
            file_data = CSV.read(path, :headers => true)
                #author_values
                data[ file_data.headers[1].gsub(' ', '') ] = entry.gsub('movements/', '').gsub(' - MAIN.csv', '')
            end

            save(site, "author", pretty_print(data.sort.to_h.to_json))            
        end
    end
end
