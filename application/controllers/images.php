<?php 

class Images extends CI_Controller{

	function __construct(){

		parent::__construct();
	}

	function index(){

		//get selected id
		$id = ( $this->input->post('id') ) ? $this->input->post('id') : false;

		//get images
		$images = $this->image->all();

		//move selected image to front of array
		$i = 0;

		foreach($images as $image){

			if( $image->id == $id ){

				$selected = $image;
				$selected->selected = true;

				unset( $images[$i] );

				array_unshift($images, $selected);
			}
			else{

				$image->selected = false;
			}

			++$i;
		}

		$data = array(

			'images'   => $images,
			'selected' => $id
		);

		$this->load->view('admin/image', $data);
	}

	function save(){

        $config['upload_path']   = './assets/uploads';
        $config['allowed_types'] = 'gif|jpg|png';
        $config['max_size']      = 2097152;
        $config['max_width']     = 1024;
        $config['max_height']    = 768;

        $this->load->library('upload', $config);

        if( !$this->upload->do_upload('sr_new')  ){

        	//create return data
        	$data = array('error' => $this->upload->display_errors());

        	//display errors
            echo json_encode($data);
        }
        else{

        	//save image
        	$id = $this->image->save( $this->upload->data() );

        	//create return data
        	$data = array(

        		'id'      => $id,
        		'img'     => $this->upload->data(),
        		'success' => true
        	);

        	echo json_encode( $data );
        }

        exit();
	}

	function select(){

		if( $this->input->post('img') ){

			//select image
			$this->rep->select( $this->input->post('img') );

			echo true;

			exit();
		}
	}

	function delete(){

		if( $this->input->post('img') ){

			//get id
			$id = $this->input->post('img');

			//delete in db
			$this->image->delete($id);

			//delete image
			unlink('./assets/uploads/' . $this->input->post('file'));

			echo true;

			exit();
		}
	}
}