var a = {
	scenario: {
		exec: function(cnf){
			cnf.data.output = {
				print	: true
				,format	: 'json'
			};
			//console.log(cnf.data);
			$.ajax({
				type	: "post"
				,async	: false
				,url	: cnf.url
				,data	: cnf.data
				,success: function(msg){
					if ( 'function'===typeof(cnf.callback.success) ){
						cnf.callback.success(msg);
					}
				}
				,failure: function(msg){
					console.log(msg);
					if ( 'function'===typeof(cnf.callback.failure) ){
						cnf.callback.failure(msg);
					}
				}
			});
		}
	}
	,file	: {
		read: function(cnf){
			$.ajax({
				type	: "post"
				,async	: false
				,url	: cnf.url.cprd
				,data	: {
					url			: cnf.url.rqp
					,operation	: 'rf'
					,fp			: cnf.fp
					,output		: {
						print	: true
						,format	: 'json'
					}
				}
				,success: function(msg){
					if ( 'function'===typeof(cnf.callback.success) ){
						cnf.callback.success(JSON.parse(msg));
					}
				}
				,failure: function(msg){
					console.log(msg);
					if ( 'function'===typeof(cnf.callback.failure) ){
						cnf.callback.failure(msg);
					}
				}
			});
		}
		,write: function(cnf){
			$.ajax({
				type	: "post"
				,async	: false
				,url	: cnf.url.cprd
				,data	: {
					url			: cnf.url.rqp
					,operation	: 'sf'
					,fp			: cnf.fp
					,data		: cnf.data
					,output		: {
						print	: true
						,format	: 'json'
					}
				}
				,success: function(msg){
					if ( 'function'===typeof(cnf.callback.success) ){
						cnf.callback.success(JSON.parse(msg));
					}
				}
				,failure: function(msg){
					console.log(msg);
					if ( 'function'===typeof(cnf.callback.failure) ){
						cnf.callback.failure(msg);
					}
				}
			});
		}
	}
	,form	: {
		update	: function(cnf){
			//cnf.data['set'] = {};
			$.each(cnf.form.find(':input:not([type="hidden"],[type="button"],[type="submit"])'), function (index, element) {
				if( 'string' == typeof( $(element).val() ) )
					cnf.data['set'][$(element).attr('name')] = $(element).val();
				if( 'object' == typeof( $(element).val() ) )
					cnf.data['set'][$(element).attr('name')] = JSON.stringify($(element).val());
			});
			cnf.data['where']	= new Array;
			$.each(cnf.form.find('input[type=hidden]'), function (index, element) {
				if( 'tn'==$(element).attr('name') )
					cnf.data['table'] = $(element).val();
				else
					cnf.data['where'].push({
						'k'	: $(element).attr('name') 
						,'v': $(element).val() 
						,'c': '=' 
					});
			});
			a.db.update(cnf);
		}
		,insert	: function(cnf){
			var data = {
				url			: cnf.url.rqp
				,operation	: 'insert'
				,output		: {
					print	: true
					,format	: 'json'
				}
			};
			var set = {};
			$.each(cnf.form.find('input[type=text],input[type=email],input[type=tel],select,textarea'), function (index, element) {
				if( 'string' == typeof( $(element).val() ) )
					set[$(element).attr('name')] = $(element).val();
				if( 'object' == typeof( $(element).val() ) )
					set[$(element).attr('name')] = JSON.stringify($(element).val());
			});
			data['set']		= set;
			$.each(cnf.form.find('input[type=hidden]'), function (index, element) {
				if( 'tn'==$(element).attr('name') )
					data['table'] = $(element).val();
			});
			$.ajax({
				type	: "post"
				,async	: false
				,url	: cnf.url.cprd
				,data	: data
				,success: function(msg){
					var jsd = JSON.parse(msg);
					if ( 'function'===typeof(cnf.callback.success) ){
						cnf.callback.success(msg);
					}
				}
				,failure: function(msg){
					console.log(msg);
					if ( 'function'===typeof(cnf.callback.failure) ){
						cnf.callback.failure(msg);
					}
				}
			})
		}
		,delete	: function(cnf){
			cnf.data['where']	= new Array;
			$.each(cnf.form.find('input[type=hidden]'), function (index, element) {
				if( 'tn'==$(element).attr('name') )
					cnf.data['table'] = $(element).val();
				else
					cnf.data['where'].push({
						'k'	: $(element).attr('name') 
						,'v': $(element).val() 
						,'c': '=' 
					});
			});
			a.db.delete(cnf);
		}
		
		,isValid: function(form){
			formValid = true;
			$(form).find('input, select').each(function() {
				//найти предков, которые имеют класс .form-group, для установления success/error
				var formGroup = $(this).parents('.form-group');
				//найти glyphicon, который предназначен для показа иконки успеха или ошибки
				var glyphicon = formGroup.find('.form-control-feedback');
				//для валидации данных используем HTML5 функцию checkValidity
				if (this.checkValidity()) {
					//добавить к formGroup класс .has-success, удалить has-error
					formGroup.addClass('has-success').removeClass('has-error');
					//добавить к glyphicon класс glyphicon-ok, удалить glyphicon-remove
					glyphicon.addClass('glyphicon-ok').removeClass('glyphicon-remove');
				} else {
					//добавить к formGroup класс .has-error, удалить .has-success
					formGroup.addClass('has-error').removeClass('has-success');
					//добавить к glyphicon класс glyphicon-remove, удалить glyphicon-ok
					glyphicon.addClass('glyphicon-remove').removeClass('glyphicon-ok');
					//отметить форму как невалидную 
					formValid = false;
				}
			});
			return formValid;
		}
	}
	,jsonFrorm : {
		build: function(cnf){
			form_cntainer = cnf.form.find('div:first');
			form_cntainer.empty();
			for(var k in cnf.data) {
				var str = '';
				cnf.data[k].id = k;
				if( undefined==cnf.data[k].html ) cnf.data[k].html = {};
				if( undefined==cnf.data[k].html.div_len ) cnf.data[k].html.div_len = 4;				
				if(typeof cnf.data[k].title === 'undefined') cnf.data[k].title = cnf.data[k].id;
				str += '<div class="col-sm-'+cnf.data[k].html.div_len+'">';
				str += '<label for="'+cnf.data[k].id+'">'+cnf.data[k].title+'</label>';
				switch(cnf.data[k].type){
					case 'input':
						if ( undefined == cnf.data[k].input.type ) cnf.data[k].input.type = 'text';
						str += '<'+cnf.data[k].type+' name='+cnf.data[k].id+' class="form-control"';
						if('object' === typeof cnf.data[k][cnf.data[k].type]){
							for(var j in cnf.data[k][cnf.data[k].type]){
								str += j+'="'+cnf.data[k][cnf.data[k].type][j]+'"';
							}
						}
						str += '>';
					break;
					case 'select':
						str += '<'+cnf.data[k].type+' name="'+cnf.data[k].id+'" class="form-control"';
						if('object' === typeof cnf.data[k][cnf.data[k].type]){
							for(var j in cnf.data[k][cnf.data[k].type]){
								str += j+'="'+cnf.data[k][cnf.data[k].type][j]+'"';
							}
						}
						str += '>';
						if('object' === typeof cnf.data[k].enum){
							for(var j in cnf.data[k].enum){
								if('object' === typeof cnf.data[k].enum[j]){
									str +='<option value="'+cnf.data[k].enum[j].value+'">'+cnf.data[k].enum[j].name+'</option>';
								}
								else str +='<option>'+cnf.data[k].enum[j]+'</option>';
							}
						}
						str += '</'+cnf.data[k].type+'>';
					break;
					case 'textarea':
						str += '<'+cnf.data[k].type+' name="'+cnf.data[k].id+'" class="form-control"';
						if('object' === typeof cnf.data[k][cnf.data[k].type]){
							for(var j in cnf.data[k][cnf.data[k].type]){
								str += j+'="'+cnf.data[k][cnf.data[k].type][j]+'"';
							}
						}
						str += '>';
						if('object' === typeof cnf.data[k].enum){
							for(var j in cnf.data[k].enum){
								if('object' === typeof cnf.data[k].enum[j]){
									str +='<option value="'+cnf.data[k].enum[j].value+'">'+cnf.data[k].enum[j].name+'</option>';
								}
								else str +='<option>'+cnf.data[k].enum[j]+'</option>';
							}
						}
						str += '</'+cnf.data[k].type+'>';
					break;
				}
				str += '</div>';
				form_cntainer.append(str).find('[name="'+cnf.data[k].id+'"]').val(cnf.data[k].value);
			}
		}
	}
	,table : {
		getOrderby	: function(){
			var cnf = {
				data : {
					orderby : new Array
				}
			};
			$.each($('form.tableSort').serializeArray(), function (i, o) {
				cnf.data['orderby'] += o.value + " ";
			});
			return cnf.data['orderby'];
		}
		,getGroupby	: function(){
			var cnf = {
				data : {
					groupby : null
				}
			};
			cnf.data['groupby'] = $('form.tableGroup select[name=groupby]').val();
			
			if( Array.isArray(cnf.data['groupby']) )
				cnf.data['groupby'] = cnf.data['groupby'].toString();
			return cnf.data['groupby'];
		}
		,getWhere	: function(){
			
			var cnf = {
				data : {
					where : []
					,keys : []
				}
			};
			$('form.tableFilter input, form.tableFilter select').each(function(){
				var input = $(this);
				var w = {
					k  : '' ,v : '' ,j : '' ,c : ''
				};
				w.k = input.attr('name');
				
				if( 0 <= cnf.data.keys.indexOf(w.k) || ''==input.val() )return;	// (continue)
				cnf.data.keys.push(w.k);
				
				if(0 < w.k.indexOf('[]')){
					w.v = $('input[name="'+input.attr('name')+'"]').map(function(){return $(this).val();}).get();
					w.k = w.k.substr(0, w.k.length - 2);
				}
				else{
					w.v = input.val();
				}
				if(undefined == input.attr('c'))
					if( Array.isArray(w.v) )		w.c = 'IN';
					else 							w.c = '=';
				else w.c = input.attr('c');
				if(undefined == input.attr('j'))	w.j = 'AND';
				if( w.v && 0 !== w.v.length ){
					cnf.data.where.push(w);
				}
			})
			return cnf.data['where'];
		}
		,getLimit	: function(){
			e.s.limit.offset = e.s.limit.page * e.s.limit.row_count;
			return e.s.limit.offset+', '+e.s.limit.row_count;
		}
	}
	,db	: {
		select	: function(cnf1){
			var cnf = {
				data : {
					operation	: 'select'
					,table		: ''
					,limit		: '0, 180'
					,where		: '1'
					,orderby	: '1'
					,groupby	: ''
					,output		: {
						print	: true
						,format	: 'json'
					}
				}
			};
			$.extend( true, cnf, cnf1 );
			
			if(	undefined==cnf.data.url 		|| ''== cnf.data.url	// адрес обработчика запросов
				|| undefined==cnf.data.table	|| ''== cnf.data.table
				|| undefined==cnf.url			|| ''== cnf.url			// адрев в этом домене, который проксирует к обработчику запросов
			){	console.log('не могу продложить, так как передан плохой конфиг');
				console.log(cnf);
				return false;
			}
			
			$.ajax({
				type	: "post",
				async	: false,
				url		: cnf.url,
				data	: cnf.data,
				success: function(msg){
					if ( 'function'===typeof(cnf.callback.success) ){
						cnf.callback.success(msg);
					}
				}
				,failure: function(msg){
					console.log(msg);
					if ( 'function'===typeof(cnf.callback.failure) ){
						cnf.callback.failure(msg);
					}
				}
			})
		}
		,update	: function(cnf1){
			var cnf = {
				data : {
					operation	: 'update'
					,where		: '1'
					,output		: {
						print	: true
						,format	: 'json'
					}
				}
			};
			$.extend( true, cnf, cnf1 );
			
			if(	undefined==cnf.data.url 		|| ''== cnf.data.url	// адрес обработчика запросов
				|| undefined==cnf.data.table	|| ''== cnf.data.table
				|| undefined==cnf.data.set		|| ''== cnf.data.set
				|| undefined==cnf.data.where	|| '1'== cnf.data.where
				|| undefined==cnf.url			|| ''== cnf.url			// адрес в этом домене, который проксирует к обработчику запросов
			){	
				var msg = 'не могу выполнить, так как передан плохой конфиг';
				console.log(msg);
				cnf.callback.failure(msg);
				return false;
			}
			$.ajax({
				type	: "post"
				,async	: false
				,url	: cnf.url
				,data	: cnf.data
				,success: function(msg){
					if ( 'function'===typeof(cnf.callback.success) ){
						cnf.callback.success(msg);
					}
				}
				,failure: function(msg){
					console.log(msg);
					if ( 'function'===typeof(cnf.callback.failure) ){
						cnf.callback.failure(msg);
					}
				}
			})
		}
		,delete	: function(cnf1){
			var cnf = {
				data : {
					operation	: 'delete'
					,where		: '1'
					,output		: {
						print	: true
						,format	: 'json'
					}
				}
			};
			$.extend( true, cnf, cnf1 );
			
			if(	undefined==cnf.data.url 		|| ''== cnf.data.url	// адрес обработчика запросов
				|| undefined==cnf.data.table	|| ''== cnf.data.table
				|| undefined==cnf.data.where	|| '1'== cnf.data.where
				|| undefined==cnf.url			|| ''== cnf.url			// адрес в этом домене, который проксирует к обработчику запросов
			){	
				var msg = 'не могу выполнить, так как передан плохой конфиг';
				console.log(msg);
				cnf.callback.failure(msg);
				return false;
			}
			$.ajax({
				type	: "post"
				,async	: false
				,url	: cnf.url
				,data	: cnf.data
				,success: function(msg){
					if ( 'function'===typeof(cnf.callback.success) ){
						cnf.callback.success(msg);
					}
				}
				,failure: function(msg){
					console.log(msg);
					if ( 'function'===typeof(cnf.callback.failure) ){
						cnf.callback.failure(msg);
					}
				}
			})
		}
	}
	,data	: {
		json	: {
			killNullTrim : function(jso){
				switch( typeof(jso) ){
					case'object': // ok
					break;
					case'string':
						jso = JSON.parse(jso)
					break;
					default:
						console.log('невозможно приозвести преобразование типов');
						return null;
				}
				return JSON.parse(
					JSON.stringify(jso, function(key, value) {
						if(value === null) {
							return "";
						}
						if('string'==typeof(value))
							return value.trim();
						// otherwise, leave the value unchanged
						return value;
					})
				);
			}
		}
		,string : {
			moneyFormat1 : function(n){ // округаляет до сотых или целых
				if( isNaN(n) ) return n;
				
				if( this.is_float(n) ) 
					n = n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
				else
					n = new String(n).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
				return n+'<small> ₽</small>'
			}
			,moneyFormat2 : function(n){ // округаляет до целых
				if( isNaN(n) ) return n;
				n = this.numFormat2(n);
				return n+'<small> ₽</small>'
			}
			,numFormat2 : function(n){ // округаляет до целых
				if( isNaN(n) ) return n;
				return new String( Math.round( n ) ).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
			}
			,is_float : function(mixed_var) {
				return +mixed_var === mixed_var && (!isFinite(mixed_var) || !! (mixed_var % 1));
			}
		}
	}
	,math : {
		getRandomInt : function(min, max)
		{
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}
}