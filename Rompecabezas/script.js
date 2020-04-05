    var row = 4;
    var col = 4;
    var size = 150;
    var selected_x = 0;
    var selected_y = 0;
    var ctx = null;
    var pos_x = (document.documentElement.clientWidth-(size*col))/2;
    var pos_y = (document.documentElement.clientHeight-(size*row))/2;
    var tag = null;
    var empty_x = 0;
    var empty_y = 0;
    var boxes = new Array(); 
    var image = new Image();
    var background = new Image();
    var complete = new Image();
    var finish = false;

    var box=function(c,r){
      this.col_index=c;
      this.row_index=r;

      this.update=function(new_c,new_r){
        this.random_col_index=new_c;
        this.random_row_index=new_r;
        this.x=pos_x+(size*this.random_col_index);
        this.y=pos_y+(size*this.random_row_index);
      };

      this.analize=function(){   
        this.match_x=(selected_x==this.random_col_index);
        this.match_y=(selected_y==this.random_row_index);
        this.selected=(this.match_x && this.match_y);
        this.match_empty_x=(empty_x==this.random_col_index);
        this.match_empty_y=(empty_y==this.random_row_index);
        this.is_empty=(this.match_empty_x && this.match_empty_y);
        this.is_correct=(this.col_index==this.random_col_index && this.row_index==this.random_row_index);
      }
      return this;
    }; 

    draw_background=function(){
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 0, 0, 0)";
      ctx.drawImage(background, 0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
      ctx.fill();
      ctx.rect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
      ctx.restore();
    };

    draw_finish=function(){
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 0, 0, 0)";
      ctx.drawImage(complete,pos_x,  pos_y,size*col,size*row);
      ctx.fill();
      ctx.rect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
      ctx.restore();
    };

    draw_grid=function() { 
      draw_background();

      

      var img_w=image.width/col;
      var img_h=image.height/row;

      var correct=true;

      for(var i=0;i<boxes.length;i++){
        var e=boxes[i];
        e.analize();

         if(!e.is_correct)
          correct=false;

        ctx.beginPath();
        if(!e.is_empty)
          ctx.drawImage(image, img_w*e.col_index, img_h*e.row_index, img_w, img_h, e.x, e.y, size, size);
        ctx.rect(e.x, e.y, size, size);
        ctx.strokeStyle = "#111111";
        ctx.lineWidth = 0.5;
        ctx.fillStyle = (!e.is_empty?
          (e.selected?'rgba(250, 0, 0, 0.56)':'rgba(0, 0, 0, 0)'):
          (e.selected?'green':'#222222'));
        ctx.stroke();
        ctx.fill();
        ctx.restore();
      }

      if(finish)
        draw_finish();

      finish=correct;

      window.requestAnimationFrame(draw_grid);
    };

    key_down=function(e) {
      if(!finish){
        if(e.keyCode==37){
          selected_x--;     
          if(selected_x<0)
            selected_x=col-1;   
        }
        if(e.keyCode==39){
          selected_x++;     
          if(selected_x>=col)
            selected_x-=col;  
        }
        if(e.keyCode==38){
          selected_y--;
          if(selected_y<0)
            selected_y+=row;
        }
        if(e.keyCode==40){
          selected_y++;
          if(selected_y>=row)
            selected_y-=row;
        }     
        if(e.keyCode==13)
          move_box();        
      }
    };

    move_box=function(){
      var current_box=boxes.filter(function(x){
        return (x.random_row_index==selected_y) && (x.random_col_index==selected_x);
      })[0];
      if(current_box!=null){
        if(!current_box.is_empty){
          var temp_x=current_box.random_col_index;
          var temp_y=current_box.random_row_index;
          var empty_box=boxes.filter(function(x){
            return x.is_empty==true;
          })[0];
          var valid=false;
          var floor_x=Math.abs(temp_x-empty_x);
          var floor_y=Math.abs(temp_y-empty_y);
          if((floor_x+floor_y)==1)
            valid=true;
          if(valid){
            current_box.update(empty_x,empty_y);
            empty_box.update(temp_x,temp_y);
            empty_x=temp_x;
            empty_y=temp_y;
          }
        }
      }
    };

    on_load=function(){
      image.src="https://i.pinimg.com/originals/d7/3b/be/d73bbed199a6edaf57159a70793b9cc2.jpg";
      complete.src="https://www.somosxbox.com/wp-content/uploads/2017/12/Achievement-790x444.jpg";

      tag = document.getElementById("canvas");
      tag.width = document.documentElement.clientWidth;
      tag.height= document.documentElement.clientHeight;

      ctx = tag.getContext('2d');

      empty_x=random_int(0,col-1);
      empty_y=random_int(0,row-1);

      for(var r=0;r<row;r++){
        for(var c=0;c<col;c++){
          boxes.push(new box(c,r));
        }
      }

      random_box(boxes);

      window.addEventListener('keydown',this.key_down,false);
      window.requestAnimationFrame(draw_grid);
    };

    random_box=function(e){
      for(var i=0;i<boxes.length;i++){ 
        var valid=false; 
        while(!valid){
          var random_x=random_int(0,col-1);
          var random_y=random_int(0,row-1);
          var search=boxes.filter(function(x){
            return (x.random_col_index==random_x) && (x.random_row_index==random_y);
          })[0];
          if(search==null){
            boxes[i].update(random_x,random_y);
            valid=true;
          }
        }      
      }
    };

    random_int=function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };