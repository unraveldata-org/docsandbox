store['en'] = {};


        $(document).ready(function () {
        
            
            indexDict['en']  = lunr(function () {

            

                this.field('title', {boost: 10});
                this.field('body');
                this.ref('id');
            

        
this.add({ id: 1, 
title: "Compatibility Matrix", 
body: " compatibility matrix " });

        store['en'][1]= {
        'title': "Compatibility Matrix",
        'href': 'compatibility-inverted.html'
        
            , 'breadcrumbs': "compat \/ Compatibility Matrix"
                , 'snippet': "CDH 6.1.x Unravel version 4.5.3 4.5.1.0 4.5.1.1 Base OS CentOS\/ RHEL 7.5-7.6 7.5-7.6 Applications Airflow - 1.9.0 Hadoop 3.0.0 - HBase 2.1.0 2.0.0 Hive 2.1.1 2.1.1 Impala 3.1.0 3.1.0 Kafka 1.0.1 1.0.1 MR MR v2 MR v2 Oozie 5.0.0, 4.x 5.0.0, 4.x Spark 2.4 2.2.0 Unravel DB MySQL 5.7, 8 5.5-5.7 MySQL Cl..."
        };
        
        


            });

            $(document).trigger('search.ready');
       }); 

        