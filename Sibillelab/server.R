library(shinydashboard)
library(leaflet)
library(dplyr)
library(curl) # make the jsonlite suggested dependency explicit
library(shiny)
library(RMySQL)
library(dichromat)
library(ggplot2)
library(forestplot)

#MySQL connection 
options(mysql = list(
  "host" = "107.180.57.148", #Edit host name here
  "port" = 3306, #Edit port number here
  "user" = "sibillelab",
  "password" = "camh123"
))
databaseName <- "sibillelab"
dataTablename <- "NA"

######-------Function 1--------######
#
#LoadData()
#Import Data from MySQL database based on column names
#Use '0' as column_name to get all columns 
#
#
loadData <- function(table,column_name=0) {
  # Connect to the database
  db <- dbConnect(MySQL(), dbname = databaseName, host = options()$mysql$host, 
                  port = options()$mysql$port, user = options()$mysql$user, 
                  password = options()$mysql$password)
  # Construct the fetching query
  if(column_name==0)
  {
    q1<-paste("SELECT * FROM %s",sep = " ")
  }
  else
  {
    q1<-paste("SELECT",column_name,"FROM %s",sep = " ")
  }
  query <- sprintf(q1, table)
  # Submit the fetch query and disconnect
  data <- dbGetQuery(db, query)
  dbDisconnect(db)
  data
}
######-------End of Function 1--------######


######-------Function 2--------######
#
#LoadRow()
#Import Rows from MySQL database for specified row_ID matching `Gene Names`
#Transpose the columns
#
loadRow <- function(table,row_ID) {
  # Connect to the database
  db <- dbConnect(MySQL(), dbname = databaseName, host = options()$mysql$host, 
                  port = options()$mysql$port, user = options()$mysql$user, 
                  password = options()$mysql$password)
  # Construct the fetching query
    row_ID <- paste("'%",row_ID,"%'",sep = "")
    query<-sprintf("SELECT * FROM %s WHERE `Gene Symbol` LIKE %s",table,row_ID)
 
 
  # Submit the fetch query and disconnect
  data <- dbGetQuery(db, query)
  dbDisconnect(db)
  m1 <- as.data.frame(t(data))
  
  #colnames(m1)=c("Data")
  m1
}
######-------End of Function 2--------######


######-------Function 3--------######
#
#loadforestdata()
#Import Rows from MySQL database- all columns
#
#
loadforestdata <- function(table) {
  # Connect to the database
  db <- dbConnect(MySQL(), dbname = databaseName, host = options()$mysql$host, 
                  port = options()$mysql$port, user = options()$mysql$user, 
                  password = options()$mysql$password)
  # Construct the fetching query
  
  query<-sprintf("SELECT * FROM %s",table)
  
  
  # Submit the fetch query and disconnect
  data <- dbGetQuery(db, query)
  dbDisconnect(db)
  m1 <- as.data.frame((data))
  m1
}
######-------End of Function 3--------######


######-------Function 4--------######
#
#Data_Forest()
#Manuplates data and generates forest plot
#
#
data_forest<-function(df){
  
  #df_gene<-data.frame(stringsAsFazctors = F)
  #Subseting dataframe for the a perticular gene Symbol
  #df_gene<-subset(df,df$`Gene Symbol`==gene_name) #Not needed if importing data from mysql already queries based on gene name
  
  df_gene<-as.data.frame(df)
  
  #Creating datframe for values 
  df_data<-data.frame(label=character(),mean=numeric(),variance=numeric(),lower=numeric(),upper=numeric(),stringsAsFactors = F)
  
  
  df_data[1,1]<-"1_MD_ACC_M";
  df_data[2,1]<-"2_MD_ACC_M";
  df_data[3,1]<-"3_MD_ACC_F";
  df_data[4,1]<-"4_MD_ACC_F";
  df_data[5,1]<-"5_MD_AMY_M";
  df_data[6,1]<-"6_MD_AMY_F";
  df_data[7,1]<-"7_MD_DLPFC_M";
  df_data[8,1]<-"8_MD_DLPFC_F";
  df_data[9,1]<-"REM";
  
  df_data[1,2]<-as.numeric(df_gene$`1_MD_ACC_M_EffectSize`);
  df_data[2,2]<-as.numeric(df_gene$`2_MD_ACC_M_EffectSize`);
  df_data[3,2]<-as.numeric(df_gene$`3_MD_ACC_F_EffectSize`);
  df_data[4,2]<-as.numeric(df_gene$`4_MD_ACC_F_EffectSize`);
  df_data[5,2]<-as.numeric(df_gene$`5_MD_AMY_M_EffectSize`);
  df_data[6,2]<-as.numeric(df_gene$`6_MD_AMY_F_EffectSize`);
  df_data[7,2]<-as.numeric(df_gene$`7_MD_DLPFC_M_EffectSize`);
  df_data[8,2]<-as.numeric(df_gene$`8_MD_DLPFC_F_EffectSize`);
  df_data[9,2]<-as.numeric(df_gene$`REM_mu`);
  
  df_data[1,3]<-as.numeric(df_gene$`1_MD_ACC_M_Variance`);
  df_data[2,3]<-as.numeric(df_gene$`2_MD_ACC_M_Variance`);
  df_data[3,3]<-as.numeric(df_gene$`3_MD_ACC_F_Variance`);
  df_data[4,3]<-as.numeric(df_gene$`4_MD_ACC_F_Variance`);
  df_data[5,3]<-as.numeric(df_gene$`5_MD_AMY_M_Variance`);
  df_data[6,3]<-as.numeric(df_gene$`6_MD_AMY_F_Variance`);
  df_data[7,3]<-as.numeric(df_gene$`7_MD_DLPFC_M_Variance`);
  df_data[8,3]<-as.numeric(df_gene$`8_MD_DLPFC_F_Variance`);
  df_data[9,3]<-as.numeric(df_gene$`REM_var`);
  
  
  df_data[1,4]<-as.numeric(df_gene$`1_MD_ACC_M_Lb1`);
  df_data[2,4]<-as.numeric(df_gene$`2_MD_ACC_M_Lb2`);
  df_data[3,4]<-as.numeric(df_gene$`3_MD_ACC_F_Lb3`);
  df_data[4,4]<-as.numeric(df_gene$`4_MD_ACC_F_Lb4`);
  df_data[5,4]<-as.numeric(df_gene$`5_MD_AMY_M_Lb5`);
  df_data[6,4]<-as.numeric(df_gene$`6_MD_AMY_F_Lb6`);
  df_data[7,4]<-as.numeric(df_gene$`7_MD_DLPFC_M_Lb7`);
  df_data[8,4]<-as.numeric(df_gene$`8_MD_DLPFC_F_Lb8`);
  df_data[9,4]<-as.numeric(df_gene$`REM_lb`);
  
  df_data[1,5]<-as.numeric(df_gene$`1_MD_ACC_M_Ub1`);
  df_data[2,5]<-as.numeric(df_gene$`2_MD_ACC_M_Ub2`);
  df_data[3,5]<-as.numeric(df_gene$`3_MD_ACC_F_Ub3`);
  df_data[4,5]<-as.numeric(df_gene$`4_MD_ACC_F_Ub4`);
  df_data[5,5]<-as.numeric(df_gene$`5_MD_AMY_M_Ub5`);
  df_data[6,5]<-as.numeric(df_gene$`6_MD_AMY_F_Ub6`);
  df_data[7,5]<-as.numeric(df_gene$`7_MD_DLPFC_M_Ub7`);
  df_data[8,5]<-as.numeric(df_gene$`8_MD_DLPFC_F_Ub8`);
  df_data[9,5]<-as.numeric(df_gene$`REM_ub`);
  
  #Creating the text table and rounding off value to 2 decimal places
  df_text<-df_data
  df_text$mean<-round(df_text$mean,2)
  df_text$variance<-round(df_text$variance,2)
  df_text$lower<-round(df_text$lower,2)
  df_text$upper<-round(df_text$upper,2)
  
  #Adding lables to data df for plot 
  df_data<-rbind(c(NA,NA,NA,NA,NA),c(NA,NA,NA,NA,NA),df_data[1:8,],c(NA,NA,NA,NA,NA),df_data[9,])
  df_data <- df_data[ -c(1,3) ]
  
  #Adding lables to text df for plot 
  df_text<-rbind(c("","Effect Size","Variance","Lower","Upper"),c(NA,NA,NA,NA,NA),df_text[1:8,],c(NA,NA,NA,NA,NA),df_text[9,])
  
  #Generating Forest Plot
  fp<-forestplot(df_text, 
                 df_data,new_page = TRUE,
                 is.summary=c(TRUE,TRUE,rep(FALSE,9),TRUE),
                 col=fpColors(box="royalblue",line="darkblue", summary="royalblue"))
  
  return(fp)
}
######-------End of Function 4--------######


#Server.R starts here 
function(input, output, session) {
  
    # Select organism
    output$organism <- renderUI({
    data <- loadData("Organisms_meta","Organism")

    values <- sort(unique((data$Organism)))
    selectInput("organism_select", "Organism", choices = values, selected = values[1])
  })

    # Select data
  output$data <- renderUI({
    data <- loadData("Organisms_meta",0)
    
    values <- subset(data$Display,data$Organism==input$organism_select)
    selectInput("data_select", "Data Set", choices = values, selected = values[1])
  })
  
    # Select gene
        output$gene <- renderUI({
    
        data <- loadData("Organisms_meta",0)
        dataTablename <- as.character(subset(data$Data_table,data$Display==input$data_select)[1])
        if(is.na(dataTablename)){
          values <- " "
      
        }
        else{
          gene_list<-loadData(dataTablename,"`Gene Symbol`")
          values <- gene_list$`Gene Symbol`
      
        }
        selectInput("gene_select", "Gene Names", choices = values, selected = values[2]) 
  })

    
#Plublic Variable 'v' declaration 
  v <- reactiveValues(data = NULL)

    
#Submit button to load data on R running session 
  observeEvent(input$do,{
    #Importing Master Meta File "Organisms_meta" 
    data <- loadData("Organisms_meta",0)
    
    #Loading table names from Master Meta File
    dataTablemeta <- as.character(subset(data$Data_meta,data$Display==input$data_select)[1])
    dataTablename <- as.character(subset(data$Data_table,data$Display==input$data_select)[1])
    dataTablestat <- as.character(subset(data$Data_stat,data$Display==input$data_select)[1])
    dataTableforest <- as.character(subset(data$Data_forest,data$Display==input$data_select)[1])
    
    #Identifying Row ID (Gene Name)
    row_ID<-input$gene_select
    v$row_ID<-row_ID # Exporting to public variable 'v'
    
    #Loading MicroArray Data
    micro<-loadRow(dataTablename,as.character(row_ID))
    v$geneinfo<-as.data.frame(micro[1:3,]) #Extracting gene information and saving as public variable
    micro<-as.data.frame(micro[4:nrow(micro),]) #Removing the UI columns: Probe ID, Gene Accession and Gene Name
    colnames(micro)=c("Data") #Renaming the Column header
    
    #Loading Age data from Meta table 
    age<-loadData(dataTablemeta,"Age")
    
    #Combining Data and Age into dataframe
    #Exporting dataframe to public variable 'v'
    v$data2<-cbind(micro,age)
    
    #Loading stat information 
    stat<-loadRow(dataTablestat,as.character(row_ID))
    colnames(stat)=c(" ") #Renaming the Column header
    #exporting to public variable 'v'
    v$stat<-as.data.frame(stat)
    
    #Loading forestPlot data
    forest<-loadData(dataTableforest,0)
    #exporting to public variable 'v'
    v$forest<-as.data.frame(forest)
    
  })
  
#Display selected Gene Name in Header
      output$gene_name <- renderText({
        data<-v$stat
    
        paste("<h1> Gene Name : ",v$row_ID)
      })

    
# Display table output for scayyer plot 
      output$dbtable <- DT::renderDataTable({
   
        #Loading data from public variable
        data<-v$data2
        #Displaying data
        data
  })

    
# Allow Dowload of Scatter plot data
      output$downloadData <- downloadHandler(
          filename = function() {
          paste('Sibillelab_data_', Sys.Date(), '.csv', sep='')
        },
          content = function(con) {
          write.csv(v$data2, con)
       }
     )
  
# Generating and display of ScatterPlot 
       output$graph <- renderPlot({
    
          #Returning null if the dataframe is empty
          if (is.null(v$data2)) return()
    
          #Loading data from public variable
          data<-v$data2
          m<-as.numeric(data$Age)  #Converting Varchar to Numeric Data type
          n<-as.numeric(data$Data) #Converting Varchar to Numeric Data type
   
          #Combining Data and Age into dataframe as numeric values
          dataF<-as.data.frame(cbind(m,n))
    
          #Generating Scatter Plot  
          ggplot(dataF, aes(x=m, y=n)) +
          geom_point(shape=1) +    # Use hollow circles
          geom_smooth(method=lm,se=F) +   # Add linear regression line
          xlab("Age") +    #Xlable 
          ylab("Data")
  })
  
       
#Display all stat information 
      output$details <- DT::renderDataTable({
        #Loading stats from public variable 
        data<-v$stat
        #Display stat details 
        data
      
      })
  

#Generate and Display Forest plot
      output$forestplot <-  renderPlot({
       
        #Returning null if the dataframe is empty
        if (is.null(v$forest)) return()
    
        #Importing data from public variable
         data<-v$forest
         k<-as.character(data$`Gene Symbol`)
         m<-as.character(v$row_ID)
        #Filtering data frame based on gene name
         n<-charmatch(as.character(trimws(input$gene_select)),k)
         data<-data[n,]
         v$forest_selectedGene<-data
        #Generating Scatter Plot  
        fp<-data_forest(data)
        fp
         
      }) 
      
#Display all Gene information from Forestplot datatable
      output$Gene_Info <- renderText({
        
        #Returning null if the dataframe is empty
        if (is.null(v$forest_selectedGene)) return()
        
        
        #Loading gene data from public variable 
        data<-as.data.frame(t(v$forest_selectedGene[,5:6]))
        colnames(data)<-c("") # Renameing column header
        #Display stat details 
        paste("<div style=\"height:100%;width:100%;border:1px solid #ccc;overflow:auto;\"><b>Gene Title:</b><br>",data[1,1],"<br><br>",
              "<p><b>GO functions:</b><br>",data[2,1],
              "</div>"
              )
      })
      
 
}
