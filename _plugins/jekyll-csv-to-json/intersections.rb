module CsvToJson
    class Generator < Jekyll::Generator
        def generate_intersections(site, moment_file)
            data = Hash.new
            movement_files.each do |entry|
            path = File.join(site.source, @csv_dir, entry)
            next if File.symlink?(path) && site.safe

            #csv file data csv
            file_data = CSV.read(path, :headers => true)
                #author_values
                data[ file_data.headers[1].gsub(' ', '') ] = entry.gsub('movements/', '').gsub(' - MAIN.csv', '')
            end
        end 
    end
end

