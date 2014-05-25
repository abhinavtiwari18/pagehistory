
var serachPage = angular.module('serachPage', []);
var allpages = ["Ford Car Review","Review Car","Review Ford","Toyota Car","Honda Car","Car"];
var qrystring = "Ford Review";



// Ford

// Car 
        // Review

    // Ford Review 
        // Ford Car  // cooking French

        function PageCtrl($scope, $http) {
          $scope.pages = [];
          $scope.qhistory = [];
          var count = 0;
          var qrycount = 0; 

          $http.get('/api/pages')
          .success(function(data) {
            $scope.pages = data;

  $http.get('/api/queryhistory')
          .success(function(data) {
            $scope.qhistory = data;
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });

          })
          .error(function(data) {
            console.log('Error: ' + data);
          });




          $scope.addPage = function() {


            if($scope.pageText.split(" ").length > 8)
            {
              alert("Only Eight Keywords Allowed");
              $scope.pageText = '';
              return
            }
            
            var pagedata = {text:$scope.pageText} ;
//             $http({
//     url: '/api/pages',
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     data: pagedata
// })
$http.post('/api/pages',pagedata)
.success(function(data) {
  $scope.pageText = '';
  $scope.pages = data;
  // console.log(data);
})
.error(function(data) {
  console.log('Error: ' + data);
});


};

$scope.addHistory = function(){
  if($scope.qryText.split(" ").length > 8){
    alert("Only Eight Keywords Allowed");

    return

  }

  

              // console.log($scope.qryText);
              var allpages = allPagesStrength($scope.pages,$scope.qryText);
              // console.log(allpages);
              var seqpage = [];
              for(var i=0 ; i< allpages.length ; i++){
                if (i > 4){
                  break;
                }
                if (allpages[i].value != 0){
                  seqpage.push(allpages[i].page);
                }

              }

              var pagedata = {text:seqpage.join(" ")};
              // console.log(seqpage.join(" "));
              // console.log(valu);
              $http.post('/api/queryhistory',pagedata)
.success(function(data) {
  $scope.qryText = '';
  $scope.qhistory = data;
  // console.log(data);
})
.error(function(data) {
  console.log('Error: ' + data);
});

              // $scope.qhistory.push({text:seqpage.join(" "), value: valu });
              // $scope.qryText = '';
            }

          $scope.updateQryCount = function() {
            qrycount = qrycount + 1 ;
            return qrycount;

          };

          $scope.updateCount = function() {
            count = count + 1 ;
            return count;
          };

          $scope.deletePage = function(e) {
            var id =    $(event.currentTarget).attr('id')


            $http.delete('/api/pages/'+id)
            .success(function(data) {
              $scope.pageText = '';

$scope.pages = data;
// console.log(data);
})
            .error(function(data) {
              console.log('Error: ' + data);
            });



          };

          $scope.removeHistory = function(e) {
           $scope.qhistory.splice(0, 1);
           var oldHistory = $scope.qhistory;
           $scope.qhistory = [];
           qrycount = 0;
           angular.forEach(oldHistory, function(history) {

            var value = 'Q' + $scope.updateQryCount();
            $scope.qhistory.push({text:history.text, value: value });

          });
         };


       }
       function showAddPages(el){
        $('#add-page').show();
        $('#search-page').hide();
//   var $scope = angular.element(el).scope();
    // console.log($scope.pages);
    //   allPagesStrength($scope.pages,qrystring);
  }
  function showSearchPages(el){   
    $('#add-page').hide();
    $('#search-page').show();
    //   var $scope = angular.element(el).scope();
    // console.log($scope.pages);
        //   allPagesStrength($scope.pages,qrystring);
      }
      function masterSearch(pagelist,qrystring){
        // console.log(qrystring);
        var pagest = 0;
        var qryst = qrystring;
        var qryarr = qryst.split(" ");
        for (var i=0; i < qryarr.length; i++)
        {
          if(pagelist.indexOf(qryarr[i]) >= 0){
            pagest = pagest + (8-pagelist.indexOf(qryarr[i]))*(8-i);
          }

        }
        return pagest;
      }



      function allPagesStrength(allpages,qrystring){

        var pagelist = [];
        var arrStrength = [];
        for (var i=0;  i < allpages.length; i++){
          pagelist = allpages[i].text.split(" ");
          // console.log(pagelist);
          // console.log(qrystring);
          arrStrength.push({page:allpages[i].value, text:allpages[i].text, value: masterSearch(pagelist, qrystring)});
        }
        arrStrength.sort(function(a, b){
          return b.value-a.value
        });
        // console.log (arrStrength);
        return arrStrength;
      }


