jQuery(document).ready(function () {
	var words = '';
	var rules = '';
	$.get(chrome.extension.getURL('files/words.txt'),function(data){
		//console.log(data);
		words = data.trim();
	},'text');
	$.get(chrome.extension.getURL('files/rules.txt'),function(data){
		//console.log(data);
		rules = data.trim();
	},'text');
	setTimeout(function(){
		words = words.split(',');
		rules = rules.split('\n');
		console.log(words);
		console.log(rules);
	},1000);
	function findValueInString(keywords){
		keywords = keywords.split(' ');
		console.log(keywords);
		for (var k=0; k<keywords.length; k++)
		{
			for(var m=0;m<words.length;m++){
				if (keywords[k]==words[m])
				{
					return true;
				}
			}
		}
		return false;
	}
	$('#another_search').click(function(){
		$('#result_table').find("tr:gt(0)").remove();
		$("#keywords").val('');
		$('#search-result').hide();
		$('#formyoutube').show();
		$('#spinner').hide();
	});
	function doSetTimeout(search_keywords_value,index,last) {
		setTimeout(function() { 
			search_part = search_keywords_value.replace(" ","+");
			var fullUrl = 'https://www.youtube.com/results?search_query=allintitle%3A%22' + search_part + '%22';
			var partialUrl = 'https://www.youtube.com/results?search_query=allintitle%3A' + search_part;
			var partialUrl_in = 'https://www.youtube.com/results?search_query=intitle%3A' + search_part;
			var miss = 'https://www.youtube.com/results?search_query=' + search_part;
			$.get(fullUrl,function(fulldata){
				var fulldata_count = fulldata.match(/estimatedResults":"(.*)","contents/)[1];
				console.log(fulldata_count)
				$.get(partialUrl,function(partialdata){
					var partialdata_count=partialdata.match(/estimatedResults":"(.*)","contents/)[1];
					console.log(partialdata_count);
					$.get(partialUrl_in,function(indata){
						var indata_count=indata.match(/estimatedResults":"(.*)","contents/)[1];
						console.log(indata_count);
						$.get(miss,function(missdata){
							console.log(search_keywords_value);
							var misspeled = missdata.match(/estimatedResults":"(.*)","contents/)[1];
							console.log(misspeled);
							var zero = rules[0].split("  : ")[0].split(",");
							console.log(zero);
							var one = rules[1].split("  : ")[0].split(",");
							console.log(one);
							var two = rules[2].split("  : ")[0];
							console.log(two);
							var three = rules[3].split("  : ")[0].split(",");
							console.log(three);
							var four = rules[4].split("  : ")[0].split(",");
							var five = rules[5].split("  : ")[0].split(",");
							var ext_str = "<span class='green'>Excellent</span>";
							var good_str  = "<span class='green'>Good</span>";
							var avg_str = "<span class='green'>Average</span>";
							var med_str = "<span class='red'>Below Average</span>";
							var hard_str = "<span class='red'>Poor</span>";
							if (parseInt(fulldata_count) > parseInt(zero[0]) && fulldata_count < parseInt(zero[1])) {
								console.log('1');
								$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+avg_str+'</td></tr>');
							} else if (parseInt(fulldata_count) > parseInt(four[0]) && parseInt(fulldata_count) < parseInt(four[1])) {
								console.log('5');
								$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+med_str+'</td></tr>');
							} else if (parseInt(fulldata_count) > parseInt(five[0]) && parseInt(fulldata_count) < parseInt(five[1])) {
								console.log('6');
								$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+med_str+'</td></tr>');
							} else if (parseInt(fulldata_count) <= parseInt(one[0]) && parseInt(partialdata_count) <= parseInt(one[1])) {
								var match = findValueInString(search_keywords_value);
								console.log(misspeled);
								if (match == true) {
									$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+good_str+'</td></tr>');
								} else if (parseInt(indata_count) > parseInt(two)) {
									console.log("3");
									$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+avg_str+'</td></tr>');
								} else if (parseInt(fulldata_count) > parseInt(three[0]) && parseInt(partialdata_count) > parseInt(three[1])) {
									console.log("4");
										$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+avg_str+'</td></tr>');
								} else if (parseInt(misspeled) != 0) {
									console.log("2");
									$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+avg_str+'</td></tr>');
								} else {
									$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+ext_str+'</td></tr>');
								}
							} else {
								console.log('7');
								$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+hard_str+'</td></tr>');
							}
							if(last){
								$('#formyoutube').hide();
								$('#spinner').hide();
								$('#search-result').show();
							}
						},'text').fail(function() {
							$('#spinner').hide();
							$("#warningLimit").show();
							setTimeout(function(){
								$("#warningLimit").hide();
							}, 3000);
						});
					},'text').fail(function() {
						$('#spinner').hide();
						$("#warningLimit").show();
						setTimeout(function(){
							$("#warningLimit").hide();
						}, 3000);
					});
				},'text').fail(function() {
					$('#spinner').hide();
					$("#warningLimit").show();
					setTimeout(function(){
						$("#warningLimit").hide();
					}, 3000);
				});
			},'text').fail(function() {
				$('#spinner').hide();
				$("#warningLimit").show();
				setTimeout(function(){
					$("#warningLimit").hide();
				}, 3000);
			});
		}, 500);
	}
	$('#search_key').click(function(){
		var search_keywords = $("#keywords").val().split("\n");
		search_keywords = search_keywords.filter(Boolean);
		if (search_keywords.length > 21) {
				alert('Max 20 keywords allowed!');
				return false;
		}
		$('#spinner').show();
		if(search_keywords.length){
			for (var i in search_keywords){
				last=false;
				if(i==search_keywords.length-1){
					last=true;
				}
				doSetTimeout(search_keywords[i],i,last);
			}
		}
		return false;
	});
});
 
