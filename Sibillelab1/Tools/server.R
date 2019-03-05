

library(shinydashboard)
library(leaflet)
library(dplyr)
library(curl) # make the jsonlite suggested dependency explicit
library(shiny)
library(RMySQL)
library(dichromat)

options(mysql = list(
  "host" = "107.180.57.148",
  "port" = 3306,
  "user" = "sibillelab",
  "password" = "camh123"
))
databaseName <- "sibillelab"
dataTablename <- "NA"


loadData <- function(table,column_name) {
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

loadRow <- function(table,row_ID) {
  # Connect to the database
  db <- dbConnect(MySQL(), dbname = databaseName, host = options()$mysql$host, 
                  port = options()$mysql$port, user = options()$mysql$user, 
                  password = options()$mysql$password)
  # Construct the fetching query
    row_ID <- paste("'%",row_ID,"%'",sep = "")
    query<-sprintf("SELECT * FROM %s WHERE `Gene Accession` LIKE %s",table,row_ID)
 
 
  # Submit the fetch query and disconnect
  data <- dbGetQuery(db, query)
  dbDisconnect(db)
  m1 <- as.data.frame(t(data))
  m1<-as.data.frame(m1[4:nrow(m1),])
  colnames(m1)=c("Data")
  m1
}

function(input, output, session) {
  
  # Select organism
  output$organism <- renderUI({
    data <- loadData("Organisms_meta","Organism")

    values <- sort(unique((data$Organism)))
    selectInput("organism_select", "Organism", choices = values, selected = values[1])
  })

  #Select data
  output$data <- renderUI({
    data <- loadData("Organisms_meta",0)
    
    values <- subset(data$Display,data$Organism==input$organism_select)
    selectInput("data_select", "Data Set", choices = values, selected = values[1])
  })
  
  #Select gene
  
  
  
  output$gene <- renderUI({
    
    data <- loadData("Organisms_meta",0)
    dataTablename <- as.character(subset(data$Data_table,data$Display==input$data_select)[1])
    if(is.na(dataTablename)){
      values <- " "
      
    }
    else{
      gene_list<-loadData(dataTablename,"`Gene Accession`")
      values <- gene_list$`Gene Accession`
      
    }
    selectInput("gene_select", "Gene Accession", choices = values, selected = values[2]) 
   
   
  })
  v <- reactiveValues(data = NULL)
  
  observeEvent(input$do,{
    data <- loadData("Organisms_meta",0)
    dataTablemeta <- as.character(subset(data$Data_meta,data$Display==input$data_select)[1])
    dataTablename <- as.character(subset(data$Data_table,data$Display==input$data_select)[1])
    row_ID<-input$gene_select
    micro<-loadRow(dataTablename,as.character(row_ID))
    age<-loadData(dataTablemeta,"Age")
    v$data2<-cbind(micro,age)
  }
  )
  
  
  output$dbtable <- DT::renderDataTable({
    v$data2
  })
  
  output$graph <- renderPlot({
    if (is.null(v$data2)) return()
    data<-v$data2
    plot(log(as.numeric(data$Data)),log(as.numeric(data$Age)))
  })
  
  
 
  
  

  

}
