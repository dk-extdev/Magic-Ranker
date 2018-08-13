jQuery(document).ready(function () {
	if(location.href.indexOf("https://videowaveapp.com/web")!=-1){
		$('head').append("<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,400italic,700' rel='stylesheet' type='text/css'>");
		$('#step-to-success-button1').click(function(){
			$('#mask').fadeIn(300);
			$('#magicranker_container').fadeIn(300);
		});
		var magic_div = '<div id = "magicranker_container" style="display:none; width: 100%; max-width: 600px; left: 50%; transform: translateX(-50%); position: fixed; top: 60px; z-index: 99999; background: #fff;" class="container">\
			<button id="close_magic"class="btn btn-raised btn-info " style="float: right;height: 30px;font-size: 12px;">close</button>\
			<div class="fullheight">\
					<div class="starter-box">\
							<h2>Magic Video Ranker Software</h2>\
							<h4 class="lead">Guaranteed Top Rankings on YouTube in 60 Seconds!</h4>\
					</div>\
					<div id="spinner" class="'+chrome.extension.getURL('icons/load_bg.png')+'" style="position:absolute; left:23%; display:none;">\
							<img src="'+chrome.extension.getURL('icons/Distraction.gif')+'" id="busy-indicator" alt="">\
					</div>\
					<form id="formyoutube" method="post" action="">\
							<div class="search-box">\
									<div class="alert alert-info">Enter Your Keywords Here</div>\
									<div id="warningLimit" class="alert alert-danger" style="display:none;">You have reached your limit on searches set by Google, please try again tomorrow</div>\
									<textarea id="keywords" name="keywords" required></textarea>\
									<p class="text-info">Limit To 20 Keywords Per Search.</p>\
									<input type="submit" name="search" id = "search_key" style="font-size: 16px;" value="Predict Magic Keywords"/>\
							</div>\
					</form>\
					<div id = "search-result" class="search-result">\
						<div class="col-sm-8 col-sm-offset-2">\
								<div class="alert alert-info">Keyword Ranking Quality Chart</div>\
						</div>\
						<div class="table_wrapper">\
						<table id="result_table" style="height:auto;" class="table table-striped table-bordered">\
								<tr>\
										<th>Rank Quality</th>\
										<th>Guaranteed Rank Prediction</th>\
								</tr>\
						</table>\
						</div>\
						<div class="text-center" style="padding: 8px;">\
								<button id="another_search" class="btn btn-primary btn-lg" style="font-size: 16px !important;">Run Another Prediction</button>\
						</div>\
					</div>\
					<div class="clearfix"></div>\
					<br>\
					<p><center>All Right Reserved &copy; 2016 Magic Video Ranker Software</center></p>\
			</div>\
    </div>';
		$("body").append(magic_div);
		$('body').append('<div id="mask"></div>');
		$('#mask').click(function(){
			$('#magicranker_container').fadeOut(300,function(){
				$('#mask').hide();  
			});
		});
		$("#close_magic").click(function(){
			$('#magicranker_container').fadeOut(300,function(){
				$('#mask').hide();  
			});
		});
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
				var part_fulldata = fulldata.split('<p class="num-results first-focus">');
				part_fulldata = part_fulldata[1].split('</p>');
				var fulldata_count = part_fulldata[0].replace(/\D/g, '');
				console.log(fulldata_count)
				$.get(partialUrl,function(partialdata){
					var part_partialdata = partialdata.split('<p class="num-results first-focus">');
					part_partialdata = part_partialdata[1].split('</p>');
					var partialdata_count=part_partialdata[0].replace(/\D/g, '');
					console.log(partialdata_count);
					$.get(partialUrl_in,function(indata){
						var part_indata = indata.split('<p class="num-results first-focus">');
						part_indata = part_indata[1].split('</p>');
						var indata_count=part_indata[0].replace(/\D/g, '');
						console.log(indata_count);
						$.get(miss,function(missdata){
							console.log(search_keywords_value);
							var misspeled = missdata.indexOf('<span class="spell-correction-corrected">');
							var zero = rules[0].split("  : ")[0].split(",");
							var one = rules[1].split("  : ")[0].split(",");
							var two = rules[2].split("  : ")[0];
							var three = rules[3].split("  : ")[0].split(",");
							var four = rules[4].split("  : ")[0].split(",");
							var five = rules[5].split("  : ")[0].split(",");
							var ext_str = "<span class='green'>Excellent</span>";
							var good_str  = "<span class='green'>Good</span>";
							var avg_str = "<span class='green'>Average</span>";
							var med_str = "<span class='red'>Below Average</span>";
							var hard_str = "<span class='red'>Poor</span>";
							if (parseInt(fulldata_count) > parseInt(zero[0]) && fulldata_count < parseInt(zero[1])) {
								$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+avg_str+'</td></tr>');
							}else if (parseInt(fulldata_count) <= parseInt(one[0]) && parseInt(partialdata_count) <= parseInt(one[1])) {
								var match = findValueInString(search_keywords_value);
								console.log(misspeled);
								if (parseInt(misspeled) != -1) {
									$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+avg_str+'</td></tr>');
								} else if (match == true) {
									$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+good_str+'</td></tr>');
								} else if (parseInt(indata_count) > parseInt(two)) {
									$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+avg_str+'</td></tr>');
								} else if (parseInt(fulldata_count) > parseInt(three[0]) && parseInt(partialdata_count) > parseInt(three[1])) {
										$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+avg_str+'</td></tr>');
								} else {
									$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+ext_str+'</td></tr>');
								}
							} else if (parseInt(fulldata_count) > parseInt(four[0]) && parseInt(fulldata_count) < parseInt(four[1])) {
								$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+med_str+'</td></tr>');
							} else if (parseInt(fulldata_count) > parseInt(five[0]) && parseInt(fulldata_count) < parseInt(five[1])) {
								$('#result_table tr:last').after('<tr><td>'+search_keywords_value+'</td><td>'+med_str+'</td></tr>');
							} else {
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
	}
});