<?php 

class Tags extends CI_Controller{

	function __construct(){

		parent::__construct();
	}

	function index($group = false){

		if( $group ){

			//get user options
			$options = $this->option->get();

			//if tags are enabled
			if( $options->tags ){

				//get tag
				$tag = $this->tag->get($tag);

				//if tag found
				if( $tag ){

					$data = array();

					//add tag info
					$data['tag_id']   = $tag->id;
					$data['tag_name'] = $tag->name;

					$this->load->view('header');
					$this->load->view('index', $data);
					$this->load->view('footer');
				}
				else{

					$this->load->view('header');
					$this->load->view('index');
					$this->load->view('footer');
				}
			}
			else{

				$this->load->view('header');
				$this->load->view('index');
				$this->load->view('footer');
			}
		}
		else{

			redirect();
		}
	}

	function all(){

		$tags = $this->tag->all();

		$data['json'] = json_encode($tags);

		$this->load->view('json/data', $data);
	}

	function save(){

		if( $this->input->post() ){

			//set rules
			$this->form_validation->set_rules('name', 'Tag name', 'required|is_unique[tag.name]');

			//set messages
			$this->form_validation->set_message('required', 'Error: Tag Name is required.');
			$this->form_validation->set_message('is_unique', 'Error: Tag Name is already being used.');
			$this->form_validation->set_message('alpha', 'Error: Tag Name must only contain letters.');

			if( $this->form_validation->run() ){

				//get name
				$name = $this->input->post('name');

				$data = array(
					'name' => $name
				);

				//save tag
				$id = $this->tag->save($data);

				$data['json'] = json_encode( array('id' => $id) );

				$this->load->view('json/data', $data);	
			}
			else{

				$data['json'] = json_encode( array('errors' => validation_errors()) );

				$this->load->view('json/data', $data);	
			}
		}
	}

	function save_name(){

		if( $this->input->post() ){

			//set rules
			$this->form_validation->set_rules('name', 'Tag name', 'required|is_unique[tag.name]');

				if( $this->form_validation->run() ){

				$data = array();

				$data['id'] = $this->input->post('id');
				$data['name'] = $this->input->post('name');

				if( $this->tag->save($data) ){

					echo true;

					exit();
				}
			}
		}

		echo false;

		exit();
	}

	function delete(){

		if( $this->input->post('id') ){

			$id = $this->input->post('id');

			$this->tag->delete($id);

			echo true;

			exit();
		}
	}
}