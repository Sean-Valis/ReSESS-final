/*-----------------------------------------------------------------------------------------------------------------------------------------

Dynamic Faculty Listing

HTML
<!-- BEGIN CHAIR -->
<!--#include virtual="/includes_j/faculty-chair.html" -->
<!-- END CHAIR -->
<!-- BEGIN FACULTY -->
<div class="faculty-profile">
	<div class="row">
		<div ng-repeat="employee in employees" ng-class="[{ 0 :'clearfix-3'}[ employee.indexNum % 3 ], { 0 :'clearfix-2'}[ employee.indexNum % 2 ]]" ng-init="reindex(employee,'employee1')" ng-if="employee.position == 'full'">
		<!--#include virtual="/includes_j/faculty-new.html" -->
		</div>
	</div>
</div>
<!-- END FACULTY -->

HTML to change
-reindex(employee,'employee1') -> reindex(employee,'employee2') -> etc
-change employee1 to be unique if you have multiple on one page. 
-Think of this as the id.                       

HTML EXPLAINED
-ng-class is used to add a clearfix class after every 3 and 2 columns.
-Since every column is not the same height we need to clear the left of it after each 3 and 2.
-css is set to use the clearfix-3 on desktop and clearfix-2 on tablet and mobile for 2columns
-The only thing to change would be the ng-if to suite your needs
-There can only be employees seperated into full, staff, part, chair on one page or all employees.
-There can't be a mix of a full employee list then a breakdown, meaning no duplicate records.

JS Changes
-chairtitles// Lists all the titles for the position of chair
-parttitles// Lists all the titles for the position of a part time or adjunct employee
-stafftitles// Lists all the titles for the position of a staff member
-There is no fulltitles since everyone else will belong to fulltime

Each employee is appended:
-employee.position// Can be chair,full,part,staff
-employee.homepage// Link to their faculty profile (The email without everything after the @)

Reindex function:
-The Angular $index variable is thrown off because of the ng-if (Numbers begin to skip)
-This function corrects that by using fulltimecount, parttimecount, and staffcount as the new index


VLAD - 10/02/2019
- added position emeriti

VLAD - 11/02/2020
- added position 'College Assistant'

VLAD - 6/21/2021
- created second cycle for removing Doe John. Doesn't work correctly inside one cycle
- eliminated error related with Email.length not defined
-----------------------------------------------------------------------------------------------------------------------------------------*/

(function () {

	angular.module('app', [])

		.controller('EmployeeController', function ($scope, $http) {
			$scope.employees = []; //All Employees
			$scope.employeess = []; //All Employees
			var chairtitles = ['Chair', 'Full Professor/Chairperson', 'Professor and Chairperson', 'Associate Professor/Chairperson',
				'Professor/Chairperson', 'Professor/Chief Librarian and Department Chair', 'Assistant Professor and Chairperson',
				'Full-Professor/Chairperson'];  //chair
			var parttitles = ['Adjunct'];       //part time
			var stafftitles = [                 //staff
				'Adjunct CLT',
				'Adjunct College Lab Technician',
				'Adjunct Faculty',
				'Adjunct Professor',
				'Administrative Office, Circulation',
				'Administrative Specialist',
				'Administrative Support Assistant',
				'Circulation',
				'College Assistant',
				'College Lab Technician',
				'College Laboratory Technician',
				'College Office Assistant',
				'CUNY Administrative Assistant',
				'CUNY Office Assistant',
				'Department Assistant',
				'English Department Office Manager',
				'Interlibrary Loan, Circulation',
				'IT Associate',
				'IT Assistant',
				'Office Assistant',
				'Staff',
				'Technical Services'];

			var emeritititles = ['Emerita Professor', 'Emeritus Professor'];    //emeriti
			const adjunctTitles = ['Adj Lecturer', 'Adj Assc Professor', 'Adj Asst Professor', 'Adj Professor'];
			
			var fulltimecount = 0;  //Dont change
			var parttimecount = 0;  //Dont change
			var staffcount = 0;     //Dont change

			$scope.reindex = function (emp, variable) {
				//Dynamically create a variable to store index
				if (window[variable] == null)
					window[variable] = 0;
				else window[variable]++;

				emp.indexNum = window[variable];
			}

			if (window.Dept_IDs) { //if department id(s) is/are given
				$http.get("/dashboard/odata/Employees?$filter=Dept_ID%20eq%20" + Dept_IDs + "&$orderby=Last_name")
					.then(function (response) {
						angular.copy(response.data.value, $scope.employees);
						finishedLoading();
						$(".loading").removeClass("cbp loading");

					});

			} else { //If no Department ID get all faculty
				$http({
					url: "/dashboard/odata/Employees?$orderby=Last_name",
					contentType: 'application/json',
					dataType: 'json',
					method: "GET"
				}).success(function (data, status, headers, config) {
					angular.copy(data.value, $scope.employees);
					finishedLoading();
				}).error(function (data, status, headers, config) { });
			}

			//BEGIN FINISHED LOADING
			function finishedLoading() {

				// remove Doe John fake employee
				$scope.employees.forEach(function (employee, index, object) {
					if (employee.Discipline == "Test") {
						object.splice(index, 1);
					}
				});

				// add homepage email and position
				$scope.employees.forEach(function (employee) {

					//Set homepage link - characters before @
					if (employee.Email != undefined || employee.Email != null)
						if (employee.Email.length > 0)
							employee.homepage = employee.Email.substring(0, employee.Email.lastIndexOf("@"));

					//Set position - chair
					for (var i = 0; i < chairtitles.length; i++)
						if (employee.Title == chairtitles[i] || employee.Discipline == chairtitles[i]) {
							employee.position = "chair";
							break;
						}

						for (var i = 0; i < adjunctTitles.length; i++)
						if (employee.Title == adjunctTitles[i]) {
							employee.position = "adjunct";
							if (employee.Title == "Adj Lecturer") {
								employee.Title = "Adjunct Lecturer"
							}
							else if (employee.Title == "Adj Asst Professor") {
								employee.Title = "Adjunct Assistant Professor"
							}
							else if (employee.Title == "Adj Assc Professor") {
								employee.Title = "Adjunct Associate Professor"
							}
							else if (employee.Title == "Adj Professor") {
								employee.Title = "Adjunct Professor"
							}
							break;
						}

					//Set position - part
					if (employee.position == null)
						for (var i = 0; i < parttitles.length; i++)
							if (employee.Title == parttitles[i] || employee.Discipline == parttitles[i]) {
								employee.position = "part";
								break;
							}

					//Set position - staff
					if (employee.position == null)
						for (var i = 0; i < stafftitles.length; i++)
							if (employee.Title == stafftitles[i] || employee.Discipline == stafftitles[i]) {
								employee.position = "staff";
								break;
							}

					//Set position - emeriti
					if (employee.position == null)
						for (var i = 0; i < emeritititles.length; i++)
							if (employee.Title == emeritititles[i] || employee.Discipline == emeritititles[i]) {
								employee.position = "emeriti";
								break;
							}

					//Set position - full
					if (employee.position == null)
						employee.position = "full";

					if (employee.First_name == "Kellie" && employee.Last_name == "Nicoll")
						employee.position = "full";

					


				});

			}
			//END FINISHED LOADING
		});
})();